import { Menu, MenuItem } from "../../../modules/menu/index.js";
import {
  PushMenuCommand,
  DeleteAccountCommand,
} from "../../../modules/commands/index.js";

export const inventoryMenu = (createCommand) => {
  return new Menu({
    title: "Inventory",
    descriptionFn: async (ctx) => {
      let text = "";
      const steamApi = await ctx.accountManager.getSteamAPI();
      // const { inventory } = await steamApi.getInventory();
      // const groupedInv = Object.groupBy(
      //   inventory,
      //   (item) => item.market_hash_name,
      // );

      text += `Account: ${steamApi?.steamUser?.name || ctx.accountManager.accountName || "not selected"}\n\n`;
      // text += Object.entries(groupedInv)
      //   .map(([name, items]) => `${name}: ${items.length} `)
      //   .join("\n");
      return text;
    },
    itemsFn: async (ctx) => {
      const items = [];
      if (!createCommand) return items;

      const steamApi = await ctx.accountManager.getSteamAPI();
      const { inventory } = await steamApi.getInventory();
      const groupedInv = Object.groupBy(
        inventory,
        (item) => item.market_hash_name,
      );
      Object.entries(groupedInv).map(([name, itemArray]) => {
        items.push(new MenuItem(name, createCommand({ name, itemArray })));
      });

      return items;
    },
  });
};
