import { WizardFlow } from "../WizardFlow.js";
import { UpdateIdentitySecretFlowCommand } from "../../commands/index.js";

export class UpdateIdentitySecretFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "identitySecret",
        label: `identitySecret from mafile`,
        prompt: `Enter identitySecret from mafile:`,
        required: true,
        requiredMessage: `identitySecret is required`,
      },
    ]);
    this.title = "UPDATE IDENTITY SECRET";
  }

  finish() {
    return this.newResult(
      "IdentitySecret updated succesfully!",
      true,
      new UpdateIdentitySecretFlowCommand(this.data),
    );
  }
}
