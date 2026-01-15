import { Menu, MenuItem } from "../../src/menu/index.js";
import { PushMenuCommand } from "../../src/commands/index.js";
import { selectAccountMenu } from "./selectAccountMenu.js";
import { settingsAccountMenu } from "./settingsAccountMenu.js";

export const accountMenu = new Menu({
  title: "Account menu",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = [];
    if (ctx.accountManager.currentAccount) {
      items.push(
        new MenuItem("Change account", new PushMenuCommand(selectAccountMenu))
      );
      items.push(
        new MenuItem("Settings", new PushMenuCommand(settingsAccountMenu))
      );
    } else {
      items.push(
        new MenuItem("Select account", new PushMenuCommand(selectAccountMenu))
      );
    }
    return items;
  },
});
