import { AppState } from "./AppState.js";
import {
  FatalError,
  NotfoundError,
  ValidationError,
} from "./errors/index.js";

export class Application {
  constructor(ctx, view) {
    this.ctx = ctx;
    this.view = view;
  }

  async init() {
    try {
      await this.ctx.storage.ensureDir();

      const state = await this.ctx.storage.loadAppState();
      this.ctx.setAppState(new AppState(state));

      await this.ctx.accountManager.load();

      if (this.ctx.appState.accountId) {
        if (!this.ctx.accountManager.select(this.ctx.appState.accountId)) {
          this.ctx.appState.setAccountId(null);
        }
      }
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
                if (result.command) {
                  result.command.execute(this.ctx);
                }
                this.ctx.activeFlow = null;
              }
            }

            continue;
          }

          //Menu
          const menuManager = this.ctx.menuManager;
          const menu = menuManager.current;
          const items = menuManager.getItems(this.ctx);
          this.view.showMenu(menu, items, this.ctx);

          const menuItem = await this.view.getChoice(items);

          if (menuItem) {
            menuItem.command.execute(this.ctx);
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
    console.log("Application closed");
  }
}
