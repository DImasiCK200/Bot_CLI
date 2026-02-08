import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { ChooseTaskCommand } from "../../../modules/commands/index.js";
import { TaskPresenter } from "../../../modules/presenters/TaskPresenter.js";

export const showTaskInfoMenu = new Menu({
  title: "Task details:",
  isDynamic: true,

  descriptionFn: (ctx) => {
    const task = ctx.taskManager.pop();
    return task ? TaskPresenter.toLines(task).join("\n") : `No task choosen`;
  },

  itemsFn: (ctx) => {
    const items = [];

    const tasks = ctx.taskManager.getAll();
    const currentTask = ctx.taskManager.pop();

    tasks.forEach((t) => {
      if (currentTask?.id !== t.id)
        items.push(
          new MenuItem(`ID[${t.id}] - ${t.title}`, new ChooseTaskCommand(t.id)),
        );
    });

    return items;
  },
});
