import { AddAccountFlow } from "../../../flow/accountFlow/AddAccountFlow.js";
import { Command } from "../../Command.js";

export class AddAccountCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new AddAccountFlow((ctx, data) =>
      ctx.accountManager.addAccount(data),
    );
  }
}
