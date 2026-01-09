import { Account } from "./Account.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

export class AccountManager {
  constructor({ storage }) {
    this.accounts = [];
    this.currentAccount = null;

    this.storage = storage;
  }

  get currentId() {
    return this.currentAccount?.id ?? null;
  }

  // После переработки хранилища переделать
  async load() {
    const accounts = await this.storage.loadAccounts();

    if (!accounts.length) return;
    this.addAccounts(accounts);
  }

  async save() {
    if (!this.accounts) throw new ValidationError("Nothing accounts to save");
    await this.storage.saveAccounts(this.accounts);
  }

  addAccounts(accounts) {
    if (!Array.isArray(accounts)) return;

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

    if (!account) return false;
    this.currentAccount = account
    return true;
  }

  remove() {
    this.accounts = filter((item) => item.id != this.currentId);
  }
}
