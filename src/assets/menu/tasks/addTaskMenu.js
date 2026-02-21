import { Menu, MenuItem } from "../../../modules/menu/index.js";
import {
  BuyItemCommand,
  PushMenuCommand,
} from "../../../modules/commands/index.js";
import { SellItemSteamCommand } from "../../../modules/commands/index.js";

export const addTaskMenu = new Menu({
  title: "Add task menu",

  descriptionFn: (ctx) => {
    return `Choose task to activate`;
  },

  itemsFn: (ctx) => {
    const items = [];

    items.push(new MenuItem("Test command", new BuyItemCommand(ctx)));
    items.push(new MenuItem("Sell items in Steam"), new PushMenuCommand());

    return items;
  },
});
