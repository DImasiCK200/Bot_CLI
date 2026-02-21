import { SellItemSteamTaskFlow } from "../../../flow/TaskFlow/SellItemSteamTaskFlow.js";
import { Command } from "../../Command.js";

export class SellItemSteamCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new SellItemSteamTaskFlow();
    ctx.menuManager.pop();
  }
}
