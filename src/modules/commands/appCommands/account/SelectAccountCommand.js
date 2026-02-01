import { Command } from "../../Command.js";

export class SelectAccountCommand extends Command {
  constructor(accountId) {
    super();
    this.accountId = accountId;
  }

  async execute(ctx) {
    ctx.appState.setAccountId(this.accountId);
    ctx.storage.saveAppState(ctx.appState);

    await ctx.accountManager.select(this.accountId);
    ctx.menuManager.pop();
  }
}
