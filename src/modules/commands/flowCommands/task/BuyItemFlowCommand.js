import { FlowCommand } from "../../FlowCommand.js";
import { BuyItemTask } from "../../../task/BuyItemTask.js";
import { ValidationError } from "../../../errors/ValidationError.js";

export class BuyItemFlowCommand extends FlowCommand {
  execute(ctx) {
    const account = ctx.accountManager.currentAccount;
    if (!account) throw new ValidationError("No account selected");

    const task = new BuyItemTask({
      accountId: account.id,
      ...this.data,
    });

    ctx.taskManager.add(task, ctx);
  }
}
