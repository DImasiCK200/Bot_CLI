import { Command } from "./Command.js";

export class ChooseAccountCommand extends Command {
  execute(ctx) {
    ctx.account = "Account_1";
  }
}
