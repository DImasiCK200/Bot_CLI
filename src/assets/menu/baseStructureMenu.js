import { Menu, MenuItem } from "../../src/menu/index.js";

export const nameMenu = new Menu({
  title: "title",
  descriptionFn: (ctx) => `Description`,
  itemsFn: (ctx) => {
    const items = [];

    return items;
  },
});
