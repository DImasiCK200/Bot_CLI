import { Command } from "../../Command.js";

export class DeleteMessageCommand extends Command {
  async execute(ctx, view, tgCtx) {
    await view.deleteMessage(tgCtx);
  }
}
