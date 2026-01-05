import { Command } from "../Command.js";

export class BackMenuCommand extends Command {
  execute(ctx) {
    ctx.popMenu();
  }
}
