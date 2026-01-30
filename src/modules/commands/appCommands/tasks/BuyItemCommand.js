import { BuyItemTaskFlow } from "../../../flow/TaskFlow/BuyItemTaskFlow.js";
import { Command } from "../../Command.js";

export class BuyItemCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new BuyItemTaskFlow();
  }
}
