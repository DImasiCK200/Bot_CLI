import { WizardFlow } from "../WizardFlow.js";

export class UpdateSharedSecretFlow extends WizardFlow {
  constructor(callback) {
    super(
      [
        {
          key: "sharedSecret",
          label: "SharedSecret",
          prompt: `Enter SharedSecret from mafile:`,
          required: true,
          requiredMessage: `SharedSecret is required`,
        },
      ],
      callback,
    );
    this.title = "UPDATE SHARED SECRET";
  }

  finish() {
    return this.newResult(
      "SharedSecret updated succesfully!",
      true,
      this.callback,
    );
  }
}
