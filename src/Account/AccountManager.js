import { Account } from "./Account.js";

export class AccountManager {
  constructor(accounts = []) {
    this.accounts = [];
    this.currentAccount = null;

    this.addAccounts([accounts])
  }

  get currentAcountId() {
    return this.currentAccount.id
  }

  initAccounts(accounts) {
    const listAccounts = accounts.concat([...this.accounts]);
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

  addAccounts(accounts) {
    if (!Array.isArray(accounts)) return

    for (const account in accounts) {
      this.addAccounts(account)
    }
  }

  addAccount(data) {
    const id = data.id ?? this.generateNextId()
    const account = new Account({...data, id})

    this.accounts.push(account)
    return account
  }

  generateNextId() {
    
  }

  del(id) {
    this.accounts = filter((item) => item.id != id)
  }
}
