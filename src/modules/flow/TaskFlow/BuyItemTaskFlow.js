import { WizardFlow } from "../WizardFlow.js";
import { BuyItemFlowCommand } from "../../commands/flowCommands/task/BuyItemFlowCommand.js";

export class BuyItemTaskFlow extends WizardFlow {
  constructor() {
    super([
      {
        key: "itemName",
        label: "Item name:",
        prompt: "Enter item name:",
        required: true,
        requiredMessage: "Item name is required",
      },
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
        prompt: "Enter quantity:",
        required: true,
        requiredMessage: "Quantity is required",
      },
    ]);
    this.title = "BUY ITEM";
  }

  finish() {
    return this.newResult(
      "Buy item is running",
      true,
      new BuyItemFlowCommand(this.data),
    );
  }
}
