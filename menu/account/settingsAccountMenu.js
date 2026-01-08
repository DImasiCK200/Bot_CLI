import { Menu, MenuItem } from "../../src/menu/index.js";

export const settingsAccountMenu = new Menu({
  title: "Settings",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = [];

    return items;
  },
});
