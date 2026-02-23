import { AppState } from "./AppState.js";
import { FatalError, NotfoundError, ValidationError } from "./errors/index.js";

export class Application {
  constructor(ctx, view) {
    this.ctx = ctx;
    this.view = view;
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
      this.handleError(err);
      await this.view.getEnter();
    }
  }

  async run() {
    try {
      await this.init();

      while (this.ctx.isRunning) {
        try {
          // Flow
          if (this.ctx.activeFlow && !this.ctx.activeFlow.started) {
            const result = this.ctx.activeFlow.start();
            this.ctx.activeFlow.started = true;
            this.view.showFlowOutput(result);
          }

          if (this.ctx.activeFlow) {
            const input = await this.view.getInput();
            const result = this.ctx.activeFlow.handleInput(input);

            if (result) {
              if (result.message) {
                this.view.showFlowOutput(result);
              }

              if (result.done) {
                if (result.command && result.data) {
                  await result.command(this.ctx, result.data);
                }
                this.ctx.activeFlow = null;
              }
            }

            continue;
          }

          // Menu
          const menuManager = this.ctx.menuManager;
          const menu = menuManager.current;
          const items = await menuManager.getItems(this.ctx);
          await this.view.showMenu(menu, items, this.ctx);

          const menuItem = await this.view.getChoice(items);

          if (menuItem) {
            await menuItem.command.execute(this.ctx);
          }
        } catch (err) {
          this.handleError(err);
          await this.view.getEnter();
        }
      }
    } finally {
      await this.shutdown();
    }
  }

  setupSubscriptions() {
    this.ctx.taskManager.on("update", async () => {
      await this.refreshUI();
    });
  }

  async refreshUI() {
    if (this.ctx.activeFlow) return;

    const menu = this.ctx.menuManager.current;
    if (menu?.isDynamic) {
      const items = await this.ctx.menuManager.getItems(this.ctx);
      await this.view.showMenu(menu, items, this.ctx);
    }
  }

  handleError(err) {
    if (err instanceof FatalError) {
      this.view.showError(err);
      this.ctx.isRunning = false;
      return;
    }

    if (err instanceof ValidationError) {
      this.view.showError(err);
      return;
    }

    if (err instanceof NotfoundError) {
      this.view.showError(err);
      this.ctx.setAppState();
      return;
    }

    this.view.showError(new Error("Unexpected error"));
    this.ctx.isRunning = false;
    console.error(err);
  }

  async shutdown() {
    await this.ctx.storage.saveAppState(this.ctx.appState);
    await this.view.close();
    await this.ctx.accountManager.close();
    console.log("Application closed");
  }
}
