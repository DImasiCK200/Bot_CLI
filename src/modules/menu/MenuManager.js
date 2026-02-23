import { BackMenuCommand, ExitCommand } from "../commands/index.js";
import { MenuItem } from "./MenuItem.js";

export class MenuManager {
  constructor() {
    this.stack = [];
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }

  get canGoBack() {
    return this.stack.length > 1;
  }

  push(menu) {
    this.stack.push(menu);
  }

  pop() {
    if (this.canGoBack) {
      this.stack.pop();
      return true;
    }
    return false;
  }

  async getItems(ctx, tgCtx) {
    if (!this.current) return [];

    const items = await this.current.getItems(ctx);

    if (this.canGoBack) {
      items.push(new MenuItem("Back", new BackMenuCommand()));
    } else {
      items.push(new MenuItem("Exit", new ExitCommand()));
    }

    return items;
  }
}
