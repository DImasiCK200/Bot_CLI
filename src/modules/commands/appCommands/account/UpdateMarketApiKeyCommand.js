import { UpdateMarketApiKeyFlow } from "../../../flow/accountFlow/UpdateMarketApiKeyFlow.js";
import { Command } from "../../Command.js";

export class UpdateMarketApiKeyCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new UpdateMarketApiKeyFlow();
  }
}
