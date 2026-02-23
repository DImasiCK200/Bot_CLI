import { AppState } from "./AppState.js";
import { NotfoundError, ValidationError } from "./errors/index.js";

//TODO make new errorhandler
export class UserRuntime {
  constructor(session, ctx, view) {
    this.view = view;
    this.ctx = ctx;
    this.lastUpdate = 0;
    this.menu = {}; //TODO needs to do cache and delete this

    session.on("start", async () => {
      await this.safeExecute(() => this.handleStart());
    });
    session.on("close", async () => {
      await this.safeExecute(() => this.shutdown());
    });
    session.on("message", async (data, tgCtx) => {
      await this.safeExecute(() => this.handleMessage(data, tgCtx));
    });
    session.on("callbackQuery", async (data, tgCtx) => {
      await this.safeExecute(() => this.handleCallback(data, tgCtx));
    });
  }

  async safeExecute(fn) {
    try {
      await fn();
    } catch (err) {
      await this.handleError(err);
    }
  }

  async handleStart() {
    await this.init();
    await this.renderUI();
  }

  async handleMessage(text, tgCtx) {
    if (this.ctx.activeFlow) {
      await this.handleFlowInput(text, tgCtx);
    }
  }

  async handleCallback(data, tgCtx) {
    if (this.ctx.activeFlow) {
      await this.handleFlowInput(data, tgCtx);
      return;
    }

    await this.handleMenuChoice(data, tgCtx);
  }

  async handleMenuChoice(input, tgCtx) {
    const items = this.menu.items;
    const item = items[input];

    if (!item) return;

    await item.command.execute(this.ctx, this.view, tgCtx);

    if (this.ctx.activeFlow) {
      await this.handleFlowInput(input, tgCtx);
      return;
    }

    await this.renderUI();
  }

  async handleFlowInput(input, tgCtx) {
    const flow = this.ctx.activeFlow;

    if (!flow.started) {
      const result = flow.start();
      await this.view.showFlowOutput(result);
      return;
    }

    const result = flow.handleInput(input);

    if (result?.message) {
      await this.view.showFlowOutput(result);
    }

    if (result?.done) {
      if (result?.command && result.data)
        await result.command(this.ctx, result.data);

      this.ctx.activeFlow = null;
      await this.renderUI();
    }
  }

  async init() {
    try {
      const state = await this.ctx.storage.loadAppState();
      this.ctx.setAppState(new AppState(state));

      await this.ctx.accountManager.load();

      if (this.ctx.appState.accountId) {
        if (
          !(await this.ctx.accountManager.select(this.ctx.appState.accountId))
        ) {
          this.ctx.appState.setAccountId(null);
        }
      }

      this.setupSubscriptions();
    } catch (err) {
      await this.handleError(err);
    }
  }

  setupSubscriptions() {
    this.ctx.taskManager.on("update", async () => {
      const thisUpdate = Date.now();
      const diffUpdate = thisUpdate - this.lastUpdate;

      if (diffUpdate > 500) {
        this.lastUpdate = thisUpdate;
        if (this.ctx.menuManager.current.isDynamic) await this.renderUI();
      }
    });
  }

  async renderUI() {
    if (this.ctx.activeFlow) return;

    const menu = this.ctx.menuManager.current;
    this.menu.items = await this.ctx.menuManager.getItems(this.ctx);

    await this.view.showMenu(menu, this.menu.items, this.ctx);
  }

  async handleError(err) {
    if (err instanceof ValidationError) {
      this.ctx.menuManager.pop();
      await this.renderUI();

      await this.view.sendError(err);

      return;
    }

    if (err instanceof NotfoundError) {
      this.ctx.menuManager.pop();
      await this.renderUI();

      await this.view.sendError(err);
      this.ctx.setAppState();

      return;
    }

    this.ctx.menuManager.pop();
    await this.renderUI();

    await this.view.sendError(new Error("Unexpected error"));
  }

  async shutdown() {
    await this.ctx.storage.saveAppState(this.ctx.appState);
    await this.ctx.storage.close();
    await this.view.close();
    await this.ctx.accountManager.close();
  }
}
