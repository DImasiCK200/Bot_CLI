import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { addTaskMenu } from "./addTaskMenu.js";
import { showTaskInfoMenu } from "./showTaskInfoMenu.js";
import { PushMenuCommand } from "../../../modules/commands/index.js";

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

  itemsFn: (ctx) => [
    new MenuItem("Add task", new PushMenuCommand(addTaskMenu)),
    new MenuItem("Cancel task", new PushMenuCommand(cancelTaskMenu)),
    new MenuItem("Task details", new PushMenuCommand(showTaskInfoMenu)),
  ],
});
