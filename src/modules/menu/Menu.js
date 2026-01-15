export class Menu {
  constructor({ title, descriptionFn = () => "", itemsFn = () => [] }) {
    this.title = title;
    this.descriptionFn = descriptionFn;
    this.itemsFn = itemsFn;
  }

  getDescription(ctx) {
    return this.descriptionFn(ctx);
  }

  getItems(ctx) {
    return this.itemsFn(ctx);
  }
}
