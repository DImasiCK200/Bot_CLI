import { WizardFlow } from "../WizardFlow.js";
import { UpdateSharedSecretFlowCommand } from "../../commands/index.js";

export class UpdateSharedSecretFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "sharedSecret",
        label: "SharedSecret",
        prompt: `Enter SharedSecret from mafile:`,
        required: true,
        requiredMessage: `SharedSecret is required`,
      },
    ]);
    this.title = "UPDATE SHARED SECRET";
  }

  finish() {
    return this.newResult(
      "SharedSecret updated succesfully!",
      true,
      new UpdateSharedSecretFlowCommand(this.data),
    );
  }
}
