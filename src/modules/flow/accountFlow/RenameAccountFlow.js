import { WizardFlow } from "../WizardFlow.js";
import { RenameAccountFlowCommand } from "../../commands/index.js";

export class RenameAccountFlow extends WizardFlow {
  constructor(callback) {
    super(
      [
        {
          key: "accountName",
          label: "Account name",
          prompt: "Enter login:",
          required: true,
          requiredMessage: "Account name is required",
        },
      ],
      callback,
    );
    this.title = "RENAME ACCOUNT";
  }

  finish() {
    return this.newResult("Account renamed succesfully!", true, this.callback);
  }
}
