import { WizardFlow } from "../WizardFlow.js";
import { SellItemSteamFlowCommand } from "../../commands/index.js";

export class SellItemSteamTaskFlow extends WizardFlow {
  constructor(callback, data) {
    super(
      [
        {
          key: "price",
          label: "Price:",
          prompt: "Enter max price:",
          required: true,
          requiredMessage: "Price is required",
        },
        {
          key: "quantity",
          label: "Quantity:",
          prompt: `Enter quantity(max: ${data.itemsArray.length}):`,
          required: true,
          requiredMessage: "Quantity is required",
        },
      ],
      callback,
    );

    this.data = data;
    this.title = "SELL ITEM";
  }

  finish() {
    return this.newResult("Sell item is running", true, this.callback);
  }
}
