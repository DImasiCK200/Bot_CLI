import { FlowCommand } from "../../FlowCommand.js";
import { SellItemTask } from "../../../task/BuyItemTask.js";

export class SellItemSteamFlowCommand extends FlowCommand {
  execute(ctx) {
    const task = new SellItemTask({
      account: ctx.accountManager.currentAccount,
      steamApi: ctx.accountManager.getSteamAPI(),
      ...this.data,
    });

    ctx.taskManager.run(task);
  }
}
