import { Command } from "../../Command.js";
import { SellItemSteamTask } from "../../../task/SellItemSteamTask.js";
import { SellItemSteamTaskFlow } from "../../../flow/TaskFlow/SellItemSteamTaskFlow.js";

export class SellItemSteamCommand extends Command {
  constructor(data) {
    super();
    this.data = data;
  }
  async execute(ctx) {
    ctx.activeFlow = new SellItemSteamTaskFlow(async (ctx, data) => {
      const steamApi = await ctx.accountManager.getSteamAPI();

      const task = new SellItemSteamTask({
        account: ctx.accountManager.currentAccount,
        steamApi,
        ...data,
      });

      ctx.taskManager.run(task);
    }, this.data);
    ctx.menuManager.pop();
    ctx.menuManager.pop();
  }
}
