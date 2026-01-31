import { Menu, MenuItem } from "../../modules/menu/index.js";
import { BuyItemCommand } from "../../modules/commands/appCommands/tasks/BuyItemCommand.js";

export const taskMenu = new Menu({
  title: "Tasks menu",
  isDynamic: true,

  descriptionFn: (ctx) => {
    const tasks = ctx.taskManager.getAll();

    if (!tasks.length) return "No tasks";

    return tasks
      .filter((t) => t.account.id === ctx.accountManager.id)
      .map((t) => {
        const p = t.progress ? ` ${t.progress}%` : "";
        return `• ${t.title} [${t.status}]${p}`;
      })
      .join("\n");
  },

  itemsFn: (ctx) => [new MenuItem("Test command", new BuyItemCommand(ctx))],
});
