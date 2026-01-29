import { Task } from "./Task.js";

export class BuyItemTask extends Task {
  async run(ctx) {
    this.status = "running";
    this.emit("status", this.status);

    const account = ctx.accountManager.currentAccount;

    for (let i = 1; i <= 5; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      this.setProgress(i * 20);
    }

    this.status = "done";
    this.emit("status", this.status);
  }
}
