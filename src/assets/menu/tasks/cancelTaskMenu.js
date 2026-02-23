import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { CancelTaskCommand } from "../../../modules/commands/index.js";

export const cancelTaskMenu = new Menu({
  title: "Cancel Task:",
  isDynamic: true,

  descriptionFn: (ctx) => {
    const tasks = ctx.taskManager.getRunning();

    if (!tasks.length) return "No tasks";

    return tasks
      .filter((t) => t.account.id === ctx.accountManager.id)
      .map((t) => {
        const p = t.progress ? ` ${t.progress}%` : "";
        return `• ${t.title} [${t.status}]${p}`;
      })
      .join("\n");
  },

  itemsFn: (ctx) => {
    const items = [];

    const tasks = ctx.taskManager.getRunning();

    tasks.forEach((t) => {
      items.push(
        new MenuItem(`ID[${t.id}] - ${t.title}`, new CancelTaskCommand(t.id)),
      );
    });

    return items;
  },
});
