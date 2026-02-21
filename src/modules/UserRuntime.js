import { AppState } from "./AppState.js";
import { FatalError, NotfoundError, ValidationError } from "./errors/index.js";

//TODO make new errorhandler
export class UserRuntime {
  constructor(session, ctx, view) {
    this.view = view;
    this.ctx = ctx;
    this.lastUpdate = 0;

    session.on("start", async () => {
      await this.handleStart();
    });
    session.on("close", async () => {
      await this.shutdown();
    });
    session.on("message", async (data, tgCtx) => {
      await this.handleMessage(data, tgCtx);
    });
    session.on("callbackQuery", async (data, tgCtx) => {
      await this.handleCallback(data, tgCtx);
    });
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
    const items = await this.ctx.menuManager.getItems(this.ctx);
    const item = items[input];

    if (!item) return;

    await item.command.execute(this.ctx);

    if (this.ctx.activeFlow) {
      await this.handleFlowInput(input, tgCtx);
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

    if (result.message) {
      await this.view.showFlowOutput(result);
    }

    if (result.done) {
      if (result.command) await result.command.execute(this.ctx);

      this.ctx.activeFlow = null;
      await this.renderUI();
    }
  }

  async init() {
    try {
      await this.ctx.storage.ensureDir();

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
      this.handleError(err);
    }
  }

  setupSubscriptions() {
    this.ctx.taskManager.on("update", async () => {
      const thisUpdate = Date.now();
      const diffUpdate = thisUpdate - this.lastUpdate;
      this.lastUpdate = thisUpdate;

      if (diffUpdate > 500)
        if (this.ctx.menuManager.current.isDynamic) await this.renderUI();
    });
  }

  async renderUI() {
    if (this.ctx.activeFlow) return;

    const menu = this.ctx.menuManager.current;
    const items = await this.ctx.menuManager.getItems(this.ctx);

    await this.view.showMenu(menu, items, this.ctx);
  }

  handleError(err) {
    if (err instanceof FatalError) {
      this.view.sendError(err);
      this.ctx.isRunning = false;
      return;
    }

    if (err instanceof ValidationError) {
      this.view.sendError(err);
      return;
    }

    if (err instanceof NotfoundError) {
      this.view.sendError(err);
      this.ctx.setAppState();
      return;
    }

    this.view.sendError(new Error("Unexpected error"));
    this.ctx.isRunning = false;
    console.error(err);
  }

  async shutdown() {
    await this.ctx.storage.saveAppState(this.ctx.appState);
    await this.view.close();
    await this.ctx.accountManager.close();
  }
}
