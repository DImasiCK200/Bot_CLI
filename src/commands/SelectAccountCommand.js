import { Command } from "./Command.js";

export class SelectAccountCommand extends Command {
  constructor(accountId) {
    super()
    this.accountId = accountId;
  }

  execute(ctx) {
    ctx.accountManager.select(this.accountId);
  }
}
