import { Task } from "./Task.js";

export class SellItemSteamTask extends Task {
  constructor({ account, steamApi, name, price, quantity }) {
    super({
      id: crypto.randomUUID(),
      type: "sell-item-steam",
      title: `Sell: ${itemName} - ${price} RUB x${quantity}`,
    });

    this.account = account;
    this.itemName = name;
    this.steamApi = steamApi;
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
