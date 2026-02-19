import { Task } from "./Task.js";

export class BuyItemTask extends Task {
  constructor({ account, itemName, price, quantity }) {
    super({
      id: crypto.randomUUID(),
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
        const progress = Math.floor((i / this.quantity) * 100);
        if (progress !== 100) {
          this.setProgress(Math.floor((i / this.quantity) * 100));
        }
      }

      this.complete();
    } catch (err) {
      this.fail(err);
    }
  }
}
