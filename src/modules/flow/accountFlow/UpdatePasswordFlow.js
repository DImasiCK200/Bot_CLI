import { WizardFlow } from "../WizardFlow.js";
import { UpdatePasswordFlowCommand } from "../../commands/index.js";

export class UpdatePasswordFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "password",
        label: "Password",
        prompt: `Enter Password:`,
        required: true,
        requiredMessage: `Password is required`,
      },
    ]);
    this.title = "UPDATE PASSWORD";
  }

  finish() {
    return this.newResult(
      "Password updated succesfully!",
      true,
      new UpdatePasswordFlowCommand(this.data),
    );
  }
}
