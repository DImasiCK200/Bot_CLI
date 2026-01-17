import { Menu, MenuItem } from "../../../modules/menu/index.js";
import {
  RenameAccountCommand,
  UpdateIdentitySecretCommand,
  UpdateSharedSecretCommand,
  UpdatePasswordCommand,
  UpdateMarketApiKeyCommand,
} from "../../../modules/commands/index.js";

export const settingsAccountMenu = new Menu({
  title: "Settings",
  descriptionFn: (ctx) =>
    `Account: ${
      ctx.accountManager.currentAccount?.accountName ?? "not selected"
    }`,
  itemsFn: (ctx) => {
    const items = [
      new MenuItem("Rename account", new RenameAccountCommand()),
      new MenuItem("Update Password", new UpdatePasswordCommand()),
      new MenuItem("Update IdentitySecret", new UpdateIdentitySecretCommand()),
      new MenuItem("Update SharedSecret", new UpdateSharedSecretCommand()),
      new MenuItem("Update MarketApiKey", new UpdateMarketApiKeyCommand()),
    ];

    return items;
  },
});
