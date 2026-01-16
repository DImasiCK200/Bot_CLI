import { WizardFlow } from "../WizardFlow.js";
import { AddAccountFlowCommand } from "../../commands/index.js";

export class AddAccountFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "accountName",
        label: "Account name",
        prompt: "Enter login:",
        required: true,
        requiredMessage: "Account name is required",
      },
      {
        key: "password",
        label: "Password",
        prompt: "Enter password:",
        required: true,
        requiredMessage: "Password is required",
      },
      {
        key: "sharedSecret",
        label: "SharedSecret from mafile",
        prompt: "Enter SharedSecret:",
        required: false,
        requiredMessage: "SharedSecret is required",
      },
      {
        key: "identitySecret",
        label: "IdentitySecret from mafile",
        prompt: "Enter IdentitySecret:",
        required: false,
        requiredMessage: "IdentitySecret is required",
      },
      {
        key: "marketApiKey",
        label: "Market API key",
        prompt: "Enter Market API key:",
        required: false,
        requiredMessage: "Market API key is required",
      },
    ]);
    this.title = "ADD ACCOUNT";
  }

  finish() {
    return this.newResult(
      "Account added",
      true,
      new AddAccountFlowCommand(this.data)
    );
  }
}
