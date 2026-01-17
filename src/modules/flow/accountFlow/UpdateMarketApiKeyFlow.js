import { WizardFlow } from "../WizardFlow.js";
import { UpdateMarketApiKeyFlowCommand } from "../../commands/index.js";

export class UpdateMarketApiKeyFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "marketApiKey",
        label: "Market API Key",
        prompt: `Enter Market API Key from mafile:`,
        required: true,
        requiredMessage: `Market API Key is required`,
      },
    ]);
    this.title = "UPDATE MARKET API KEY";
  }

  finish() {
    return this.newResult(
      "Market API Key updated succesfully!",
      true,
      new UpdateMarketApiKeyFlowCommand(this.data),
    );
  }
}
