import { Menu, MenuItem } from "../../../modules/menu/index.js";
import {
  PushMenuCommand,
  DeleteAccountCommand,
} from "../../../modules/commands/index.js";

const countBy = (array, param) => {
  return array.reduce((acc, item) => {
    const name = item[param];

    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
};

export const inventoryMenu = new Menu({
  title: "Inventory",
  descriptionFn: async (ctx) => {
    let text = "";
    const steamApi = await ctx.accountManager.getSteamAPI();
    const { inventory } = await steamApi.getInventory();
    const countedInv = countBy(inventory, "market_hash_name");

    text += `Account: ${steamApi.steamUser.name ?? "not selected"}\n\n`;
    text += Object.keys(countedInv)
      .map((key) => {
        return `${key}: ${countedInv[key]}`;
      })
      .join("\n");
    return text;
  },
  itemsFn: (ctx) => {
    const items = [];

    return items;
  },
});
