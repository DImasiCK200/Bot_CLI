import { Task } from "./Task.js";

export class SellItemSteamTask extends Task {
  constructor({ account, steamApi, name, itemsArray, price, quantity }) {
    super({
      type: "sell-item-steam",
      title: `Sell: ${name} - ${price} RUB x${quantity}`,
    });

    this.account = account;
    this.itemName = name;
    this.itemsArray = itemsArray;
    this.steamApi = steamApi;
    this.price = price;
    this.quantity = quantity;
  }

  async run() {
    try {
      this.start();

      const itemsToSell = this.itemsArray.slice(0, this.quantity);

      for (let i = 0; i <= this.quantity; i++) {
        await this.runWithCancel(
          this.steamApi.sellItem(itemsToSell[i].assetid, this.price),
        );

        this.setProgress(Math.floor((i + 1) / this.quantity) * 100);
      }

      this.complete();
    } catch (err) {
      this.fail(err);
    }
  }
}
