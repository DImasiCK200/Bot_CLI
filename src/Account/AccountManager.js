import { Account } from "./Account.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

export class AccountManager {
  constructor({ storage }) {
    this.accounts = [];
    this.currentAccount = null;

    this.storage = storage;

    this.loadAccounts();
  }

  get currentAcountId() {
    return this.currentAccount?.id ?? null;
  }

  // После переработки хранилища переделать
  loadAccounts() {
    const accounts = [
      { accountName: "shapa" },
      { accountName: "dildik" },
      { accountName: "piska" },
    ];

    if (!accounts.length) return;
    this.addAccounts(accounts);
  }

  addAccounts(accounts) {
    if (!Array.isArray(accounts)) return

    accounts.forEach((account) => {
      this.addAccount(account);
    });
  }

  addAccount(data) {
    const id = data.id ?? this.generateNextId();
    const account = new Account({ ...data, id });

    this.accounts.push(account);
    return account;
  }

  generateNextId() {
    const ids = this.accounts.map((item) => item.id);
    return Math.max(...ids, 0) + 1;
  }

  select(id) {
    const account = this.accounts.find((item) => item.id === id);

    if (!account) throw new NotfoundError(`There isn't account with id=${id}`);
    this.currentAccount = account;
  }

  remove() {
    this.accounts = filter((item) => item.id != id);
  }
}
