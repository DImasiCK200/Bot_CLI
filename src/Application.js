export class Application {
  constructor(ctx, view) {
    this.ctx = ctx;
    this.view = view;
  }

  async run() {
    try {
      while (this.ctx.isRunning) {
        const menu = this.ctx.currentMenu;
        this.view.showMenu(menu, this.ctx);

        const menuItem = await this.view.getChoice(menu);
        if (menuItem) {
          menuItem.command.execute(this.ctx);
        }
      }
    } finally {
      this.view.close();
    }
  }
}
