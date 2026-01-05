export class Menu {
  constructor(title, descriptionFn = () => '', items = []) {
    this.title = title;
    this.descriptionFn = descriptionFn;
    this.items = items;
  }

  getDescription(ctx) {
    return this.descriptionFn(ctx);
  }
}
