import { FlowCommand } from "../../FlowCommand.js";
import { SellItemSteamTask } from "../../../task/SellItemSteamTask.js";

export class SellItemSteamFlowCommand extends FlowCommand {
  execute(ctx) {
    const task = new SellItemSteamTask({
      account: ctx.accountManager.currentAccount,
      steamApi: ctx.accountManager.getSteamAPI(),
      ...this.data,
    });

    ctx.taskManager.run(task);
  }
}
