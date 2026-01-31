import { Task } from "./Task.js";

export class BuyItemTask extends Task {
  constructor({ account, item }) {
    super({
      id: crypto.randomUUID(),
      type: "buy-item",
      title: `Buy ${item.name}`,
    });

    this.account = account;
    this.item = item;
  }

  async run() {
    try {
      this.start();
      for (let i = 1; i <= 5; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        this.setProgress(i * 20);
      }

      this.complete();
    } catch (err) {
      this.fail(err);
    }
  }
}
