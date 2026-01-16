import { Menu, MenuItem } from "../../../modules/menu/index.js";
import { RenameAccountCommand } from "../../../modules/commands/index.js";

export const settingsAccountMenu = new Menu({
  title: "Settings",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = [new MenuItem("Rename account", new RenameAccountCommand())];

    return items;
  },
});
