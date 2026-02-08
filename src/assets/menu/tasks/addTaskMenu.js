import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { BuyItemCommand } from "../../../modules/commands/index.js";

export const addTaskMenu = new Menu({
  title: "Add task menu",

  descriptionFn: (ctx) => {
    return `Choose task to activate`;
  },

  itemsFn: (ctx) => [new MenuItem("Test command", new BuyItemCommand(ctx))],
});
