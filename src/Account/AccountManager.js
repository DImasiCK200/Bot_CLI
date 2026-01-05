import { Account } from "./Account.js";

export class AccountManager {
  constructor(accounts = []) {
    this.accounts = this.initAccounts(accounts);
    this.currentAccount = "";
  }

  get currentAcountId() {
    return this.currentAccount.id
  }

  initAccounts(accounts) {
    const listAccounts = [...accounts] + this.accounts;
    const usedIds = new Set(
      listAccounts.filter((item) => item.id != null).map((item) => item.id)
    );

    let nextId = Math.max(0, ...usedIds) + 1;

    return listAccounts.map((item) => {
      if (!Object.hasOwn(item, "id") || item.id == null) {
        item.id = nextId;
        nextId++;
      }
      return new Account(item);
    });
  }

  add(account) {
    this.initAccounts([account])
  }

  del(id) {
    this.accounts = filter((item) => item.id != id)
  }
}
