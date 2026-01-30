import { Task } from "./Task.js";

export class BuyItemTask extends Task {
  constructor({ accountId, itemName, price }) {
    super({
      id: crypto.randomUUID(),
      name: `Buy item "${itemName}"`,
    });

    this.accountId = accountId;
    this.itemName = itemName;
    this.price = price;
  }

  async start(ctx) {
    super.start(ctx);

    try {
      for (let i = 1; i <= 5; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        this.setProgress(i * 20);
      }

      this.finish();
    } catch (err) {
      this.fail(err);
    }
  }
}
