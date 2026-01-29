import { BuyItemTask } from "../../task/BuyItemTask";

export class CreateBuyItemTaskFlow extends WizardFlow {
  constructor() {
    super({
      title: "Create buy task",
      steps: [
        {
          key: "itemName",
          prompt: "Enter item name:",
          required: true,
          error: "Item name is required",
        },
        {
          key: "price",
          prompt: "Enter max price:",
          required: true,
        },
      ],
      onFinish: (ctx, data) => {
        const task = new BuyItemTask({
          accountId: ctx.accountManager.id,
          data,
        });

        ctx.taskManager.create(task);
      },
    });
  }
}
