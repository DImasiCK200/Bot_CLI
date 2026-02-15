import { Task } from "./Task.js";

export class BuyItemTask extends Task {
  constructor({ account, itemName, price, quantity }) {
    super({
      type: "buy-item",
      title: `Buy: ${itemName} - ${price} RUB x${quantity}`,
    });

    this.account = account;
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

  async run() {
    try {
      this.start();
      for (let i = 1; i <= this.quantity; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        this.setProgress(Math.floor((i / this.quantity) * 100));
      }

      this.complete();
    } catch (err) {
      if (this.isCancelled) return;

      this.fail(err);
    }
  }
}
