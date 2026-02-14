import { BuyItemTaskFlow } from "../../../flow/TaskFlow/BuyItemTaskFlow.js";
import { Command } from "../../Command.js";
import { BuyItemTask } from "../../../task/BuyItemTask.js";

export class BuyItemCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new BuyItemTaskFlow((ctx, data) => {
      const task = new BuyItemTask({
        account: ctx.accountManager.currentAccount,
        ...data,
      });

      ctx.taskManager.run(task);
    });
    ctx.menuManager.pop();
  }
}
