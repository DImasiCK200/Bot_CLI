import { Command } from "../../Command.js";

export class ExitCommand extends Command {
  async execute(ctx, view, tgCtx) {
    ctx.isRunning = false;
    await view?.deleteMessage(tgCtx);
  }
}
