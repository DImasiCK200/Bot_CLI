import { FlowCommand } from "../../FlowCommand.js";

export class UpdateMarketApiKeyFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.updateMarketApiKey(this.data.marketApiKey);
  }
}
