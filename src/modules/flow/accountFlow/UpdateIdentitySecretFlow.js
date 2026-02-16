import { WizardFlow } from "../WizardFlow.js";

export class UpdateIdentitySecretFlow extends WizardFlow {
  constructor(callback) {
    super(
      [
        {
          key: "identitySecret",
          label: `identitySecret from mafile`,
          prompt: `Enter identitySecret from mafile:`,
          required: true,
          requiredMessage: `identitySecret is required`,
        },
      ],
      callback,
    );
    this.title = "UPDATE IDENTITY SECRET";
  }

  finish() {
    return this.newResult(
      "IdentitySecret updated succesfully!",
      true,
      this.callback,
    );
  }
}
