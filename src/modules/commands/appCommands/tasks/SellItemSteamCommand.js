import { SellItemSteamTaskFlow } from "../../../flow/TaskFlow/SellItemSteamTaskFlow.js";
import { Command } from "../../Command.js";

export class SellItemSteamCommand extends Command {
  constructor(data) {
    super();
    this.data = data;
  }
  execute(ctx) {
    ctx.activeFlow = new SellItemSteamTaskFlow(this.data);
    ctx.menuManager.pop();
    ctx.menuManager.pop();
  }
}
