import { AppState } from "./AppState.js";
import { ValidationError } from "./errors/ValidationError.js";

export class Context {
  constructor({ accountManager, storage, menuManager }) {
    this.isRunning = true;
    this.menuManager = menuManager;
    this.accountManager = accountManager;
    this.storage = storage;
    this.appState = new AppState({});

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
