export class Context {
  constructor({ accountManager }) {
    this.isRunning = true;
    this.menuStack = [];
    this.accountManager = accountManager;
    this.currentAccount = "";
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
