import { RenameAccountFlow } from "../../../flow/accountFlow/RenameAccountFlow.js";
import { Command } from "../../Command.js";

export class RenameAccountCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new RenameAccountFlow((ctx, data) => {
      ctx.accountManager.rename(data.accountName);
    });
  }
}
