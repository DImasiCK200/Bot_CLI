import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { BuyItemCommand } from "../../../modules/commands/appCommands/tasks/BuyItemCommand.js";
import { PushMenuCommand } from "../../../modules/commands/index.js";

export const showTaskInfo = new Menu({
  title: "Task",
  isDynamic: true,

  descriptionFn: (ctx) => {
    return `Task: ID[${}]`;
  },

  itemsFn: (ctx) => {
    const items = [];

    const tasks = ctx.taskManager.getALL()

    tasks.forEach(t => {
      items.push(new MenuItem(`ID[${t.id}] - ${t.title}`, new PushMenuCommand()))
    })

    return items;
  },
});
