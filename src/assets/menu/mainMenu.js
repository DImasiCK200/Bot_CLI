import { Menu, MenuItem } from "../../modules/menu/index.js";
import { PushMenuCommand } from "../../modules/commands/index.js";
import { taskMenu } from "./taskMenu.js";
import { accountMenu } from "./account/accountMenu.js";

export const mainMenu = new Menu({
  title: "Main menu",
  itemsFn: (ctx) => [
    new MenuItem("Tasks", new PushMenuCommand(taskMenu)),
    new MenuItem("Account", new PushMenuCommand(accountMenu)),
  ],
});
