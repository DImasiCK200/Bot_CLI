export class Context {
  constructor({ accountManager, storage }) {
    this.isRunning = true;
    this.menuStack = [];
    this.accountManager = accountManager;
    this.storage = storage;
  }

  get currentMenu() {
    return this.menuStack[this.menuStack.length - 1];
  }

  pushMenu(menu) {
    this.menuStack.push(menu);
  }

  popMenu() {
    this.menuStack.pop();
  }
}
