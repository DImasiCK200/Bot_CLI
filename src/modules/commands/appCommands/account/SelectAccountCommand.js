import { Command } from "../../Command.js";

export class SelectAccountCommand extends Command {
  constructor(accountId) {
    super();
    this.accountId = accountId;
  }

  execute(ctx) {
    ctx.appState.setAccountId(this.accountId);
    ctx.storage.saveAppState(ctx.appState);

    ctx.accountManager.select(this.accountId);
    ctx.menuManager.pop()
  }
}
