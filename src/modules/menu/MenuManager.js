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
    this.stack.pop();
  }

  getItems(ctx) {
    if (!this.current) return [];

    const items = this.current.getItems(ctx);

    if (this.canGoBack) {
      items.unshift(new MenuItem("Back", new BackMenuCommand()));
    } else {
      // items.unshift(new MenuItem("Exit", new ExitCommand()));
    }

    return items;
  }
}
