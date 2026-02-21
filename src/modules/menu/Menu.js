import { Command } from "../commands/Command.js";

export class Menu {
  constructor({
    title,
    descriptionFn = () => "",
    itemsFn = () => [],
    isDynamic = false,
  }) {
    this.title = title;
    this.descriptionFn = descriptionFn;
    this.itemsFn = itemsFn;
    this.isDynamic = isDynamic;
  }

  getDescription(ctx) {
    return this.descriptionFn(ctx);
  }

  getItems(ctx) {
    return this.itemsFn(ctx);
  }
}
