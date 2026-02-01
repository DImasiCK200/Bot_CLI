import { FlowCommand } from "../../FlowCommand.js";
import { BuyItemTask } from "../../../task/BuyItemTask.js";
import { ValidationError } from "../../../errors/ValidationError.js";

export class BuyItemFlowCommand extends FlowCommand {
  execute(ctx) {
    const task = new BuyItemTask({
      account: ctx.accountManager.currentAccount,
      ...this.data,
    });

    ctx.taskManager.run(task);
  }
}
