import { Command } from "../../Command.js";

export class DeleteAccountCommand extends Command {
  constructor() {
    super();
  }

  execute(ctx) {
    ctx.accountManager.remove();
  }
}