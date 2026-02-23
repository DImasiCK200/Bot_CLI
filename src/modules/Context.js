import { AppState } from "./AppState.js";
import { ValidationError } from "./errors/ValidationError.js";
import { AccountManager } from "./account/index.js";
import { TaskManager } from "./task/TaskManager.js";

export class Context {
  constructor({ storage, menuManager }) {
    this.isRunning = true;
    this.storage = storage;

    this.accountManager = new AccountManager({ storage });
    this.taskManager = new TaskManager();
    this.appState = new AppState({});

    this.menuManager = menuManager;
    this.activeFlow = null;
  }

  setAppState(appState) {
    if (appState instanceof AppState) {
      this.appState = appState;
    } else {
      throw new ValidationError("setAppState need AppState object");
    }
  }
}
