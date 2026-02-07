import { Menu, MenuItem } from "../../../modules/menu/index.js";
import {
  PushMenuCommand,
  DeleteAccountCommand,
} from "../../../modules/commands/index.js";
import { selectAccountMenu } from "./selectAccountMenu.js";
import { settingsAccountMenu } from "./settingsAccountMenu.js";
import { inventoryMenu } from "./inventoryMenu.js";

export const accountMenu = new Menu({
  title: "Account menu",
  descriptionFn: (ctx) =>
    `Account: ${ctx.accountManager.currentAccount?.accountName ?? "not selected"}`,
  itemsFn: (ctx) => {
    const items = [];
    if (ctx.accountManager.currentAccount) {
      items.push(new MenuItem("Inventory", new PushMenuCommand(inventoryMenu)));
      items.push(
        new MenuItem("Settings", new PushMenuCommand(settingsAccountMenu)),
      );
      items.push(
        new MenuItem("Change account", new PushMenuCommand(selectAccountMenu)),
      );
      items.push(new MenuItem("Delete account", new DeleteAccountCommand()));
    } else {
      items.push(
        new MenuItem("Select account", new PushMenuCommand(selectAccountMenu)),
      );
    }
    return items;
  },
});
