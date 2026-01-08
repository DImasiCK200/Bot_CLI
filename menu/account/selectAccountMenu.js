import { Menu, MenuItem } from "../../src/menu/index.js";
import { SelectAccountCommand } from "../../src/commands/index.js";
import { AddAccountCommand } from "../../src/commands/account/AddAccountCommand.js";

export const selectAccountMenu = new Menu({
  title: "Choose account",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = ctx.accountManager.accounts.map(
      (account) =>
        new MenuItem(account.accountName, new SelectAccountCommand(account.id))
    );
    items.push(new MenuItem("Add account", new AddAccountCommand()))
    return items;
  },
});
