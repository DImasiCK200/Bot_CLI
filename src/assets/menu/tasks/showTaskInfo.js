import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { BuyItemCommand } from "../../../modules/commands/appCommands/tasks/BuyItemCommand.js";
import { PushMenuCommand } from "../../../modules/commands/index.js";

export const showTaskInfo = new Menu({
  title: "Show task details",
  isDynamic: true,

  descriptionFn: (ctx) => {
    const task = ctx.taskManager.currentTask;
    return task
      ? Object.keys(task).reduce((sum, key, i) => {
          return sum + `${key}: ${person[key]}\n`;
        }, "")
      : `No task choosen`;
  },

  itemsFn: (ctx) => {
    const items = [];

    const tasks = ctx.taskManager.getAll();

    tasks.forEach((t) => {
      items.push(
        new MenuItem(`ID[${t.id}] - ${t.title}`, new PushMenuCommand()),
      );
    });

    return items;
  },
});
