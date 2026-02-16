import { WizardFlow } from "../WizardFlow.js";

export class UpdatePasswordFlow extends WizardFlow {
  constructor(callback) {
    super(
      [
        {
          key: "password",
          label: "Password",
          prompt: `Enter Password:`,
          required: true,
          requiredMessage: `Password is required`,
        },
      ],
      callback,
    );
    this.title = "UPDATE PASSWORD";
  }

  finish() {
    return this.newResult("Password updated succesfully!", true, this.callback);
  }
}
