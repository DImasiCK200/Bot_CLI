export class AppState {
  constructor({ currentAccountId = null }) {
    this.currentAccountId = currentAccountId;
  }

  get accountId() {
    return this.currentAccountId;
  }

  setAccountId(accountId) {
    this.currentAccountId = accountId;
  }
}
