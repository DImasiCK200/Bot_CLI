import { Flow } from "./Flow.js";
import { FlowResult } from "./FlowResult.js";

export class AddAccountFlow extends Flow {
  constructor() {
    super();
    this.title = "Add account";
  }

  start() {
    return new FlowResult({
      title: this.title,
      description: this.description,
      message: `Enter account name:`,
      data: this.data,
      step: this.step,
    });
  }

  handleInput(ctx, input) {
    if (input === "/cancel") {
      ctx.activeFlow = null;
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Cancelled",
      });
    }

    if (this.step === 0) {
      this.data.accountName = input;
      this.step++;
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Enter password:",
      });
    }

    if (this.step === 1) {
      this.data.password = input;
      this.step++;
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Enter identitySecret:",
      });
    }

    if (this.step === 2) {
      this.data.identitySecret = input;
      this.step++;
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Enter sharedSecret:",
      });
    }

    if (this.step === 3) {
      this.data.sharedSecret = input;
      this.step++;
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Enter market API key:",
      });
    }

    if (this.step === 4) {
      this.data.marketApiKey = input;
      ctx.accountManager.addAccount(this.data);
      ctx.accountManager.save() // Maybe add await?
      return new FlowResult({
        title: this.title,
        description: this.description,
        message: "Account added",
        done: true,
      });
    }
  }
}
