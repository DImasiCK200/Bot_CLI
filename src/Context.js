export class Context {
  constructor({ accountManager, storage, menuManager }) {
    this.isRunning = true;
    this.menuManager = menuManager;
    this.accountManager = accountManager;
    this.storage = storage;
  }
}
