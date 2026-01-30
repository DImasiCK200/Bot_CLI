import { Menu, MenuItem } from "../../modules/menu/index.js";
import { BuyItemCommand } from "../../modules/commands/appCommands/tasks/BuyItemCommand.js";

export const taskMenu = new Menu({
  title: "Tasks menu",
  isDynamic: true,

  descriptionFn: (ctx) => {
    const tasks = ctx.taskManager.list;
    if (!tasks.length) return "No tasks";

    return tasks
      .map((t) => `[${t.status}, ${t.accountId}] ${t.name} - ${t.progress}%`)
      .join("\n");
  },

  itemsFn: (ctx) => [new MenuItem("Test command", new BuyItemCommand(ctx))],
});
