import { WizardFlow } from "./WizardFlow.js";
import { RenameAccountFlowCommand } from "../modules/commands/index.js";

export class RenameAccountFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "accountName",
        label: "Account name",
        prompt: "Enter login:",
        required: true,
        requiredMessage: "Account name is required",
      },
    ]);
    this.title = "RENAME ACCOUNT";
  }

  finish() {
    return this.newResult(
      "Account renamed succesfully!",
      true,
      new RenameAccountFlowCommand(this.data)
    );
  }
}
