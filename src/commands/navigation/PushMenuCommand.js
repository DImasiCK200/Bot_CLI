import { Command } from "../Command.js";

export class PushMenuCommand extends Command {
  constructor(menu) {
    super();
    this.menu = menu;
  }

  execute(ctx) {
    ctx.menuManager.push(this.menu);
  }
}
