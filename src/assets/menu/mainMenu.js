import { Menu, MenuItem } from "../../modules/menu/index.js";
import { PushMenuCommand } from "../../modules/commands/index.js";
import { taskMenu } from "./tasks/taskMenu.js";
import { accountMenu } from "./account/accountMenu.js";

export const mainMenu = new Menu({
  title: "Main menu",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = [];
    items.push(new MenuItem("Account", new PushMenuCommand(accountMenu)));
    ctx.accountManager.currentAccount &&
      items.push(new MenuItem("Tasks", new PushMenuCommand(taskMenu)));
    return items;
  },
});
