import { Account } from "./Account.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

const MAX_SESSION_AGE = 1000 * 60 * 60 * 24;

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
    this.currentAccount = account;
    return true;
  }

  rename(name) {
    this.currentAccount.rename(name);
  }

  updatePassword(password) {
    this.currentAccount.updatePassword(password);
  }

  updateIdentitySecret(identitySecret) {
    this.currentAccount.updateIdentitySecret(identitySecret);
  }

  updateMarketApiKey(marketApiKey) {
    this.currentAccount.updateMarketApiKey(marketApiKey);
  }

  updateCookie(cookie) {
    this.currentAccount.updateCookie(cookie);
  }

  async createSession() {
    const sessionData = await this.currentAccount.loginAsync();

    await this.saveSession(sessionData);
  }

  async saveSession(sessionData) {
    await this.storage.saveAccountSession(
      this.currentAccount.name,
      sessionData
    );
  }

  async loadSessionFromFile() {
    this.currentAccount.setSession(
      await this.storage.loadAccountSession(this.currentAccount.name)
    );
  }

  async tryLoadSession() {
    await this.loadSessionFromFile();
    const session = this.currentAccount.session;

    if (!session.createdAt) return false;

    const age = Date.now() - session.createdAt;

    if (age > MAX_SESSION_AGE) {
      return false;
    }

    this.currentAccount.setCookies(session.cookies);
    this.currentAccount.setSessionId(session.sessionID);

    return true;
  }

  remove() {
    this.accounts = filter((item) => item.id != this.currentId);
  }
}
