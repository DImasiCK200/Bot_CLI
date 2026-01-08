import { FatalError, NotfoundError, ValidationError } from "./errors/index.js";

export class Application {
  constructor(ctx, view) {
    this.ctx = ctx;
    this.view = view;
  }

  async init() {
    this.ctx.storage.ensureDir();
    this.ctx.accountManager.load();
  }

  async run() {
    try {
      let flowOutput = null;
      this.init();

      while (this.ctx.isRunning) {
        try {
          if (this.ctx.activeFlow && flowOutput === null) {
            flowOutput = this.ctx.activeFlow.start();
          }

          if (this.ctx.activeFlow) {
            if (flowOutput?.message) {
              this.view.showFlowOutput(flowOutput);
            }

            const input = await this.view.getInput();
            flowOutput = this.ctx.activeFlow.handleInput(this.ctx, input);

            if (flowOutput?.done) {
              this.ctx.activeFlow = null;
              flowOutput = null;
            }

            continue;
          }

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
      this.shutdown();
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
      return;
    }

    this.view.showError(new Error("Unexpected error"));
    this.ctx.isRunning = false;
    console.error(err);
  }

  shutdown() {
    this.view.close();
    console.log("Application closed");
  }
}
