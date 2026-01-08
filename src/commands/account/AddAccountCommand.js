import { Command } from "../Command.js";

export class AddAccountCommand extends Command {
  execute(ctx) {
    ctx.accountManager.select(this.accountId);
  }
}
