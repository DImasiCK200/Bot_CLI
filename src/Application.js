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
      this.init();

      while (this.ctx.isRunning) {
        try {
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
          await this.view.getEnter()
          // this.ctx.menuManager.pop()
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
    console.error(err);
  }

  shutdown() {
    this.view.close();
    console.log("Application closed");
  }
}
