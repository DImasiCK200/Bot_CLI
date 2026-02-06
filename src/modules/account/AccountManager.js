import { Account } from "./Account.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

import { SteamAPI } from "../steam/SteamAPI.js";

export class AccountManager {
  constructor({ storage }) {
    this.accounts = [];
    this.currentAccount = null;

    this.storage = storage;
  }

  get id() {
    return this.currentAccount?.id ?? null;
  }

  get accountName() {
    return this.currentAccount?.accountName ?? null;
  }

  get password() {
    return this.currentAccount?.password ?? null;
  }

  get sharedSecret() {
    return this.currentAccount?.sharedSecret ?? null;
  }

  get identitySecret() {
    return this.currentAccount?.identitySecret ?? null;
  }

  get marketApiKey() {
    return this.currentAccount?.marketApiKey ?? null;
  }

  async load() {
    const accounts = await this.storage.loadAccounts();

    if (!accounts.length) return;
    this.addAccounts(accounts, false);
  }

  async save() {
    if (!this.accounts) throw new ValidationError("Nothing accounts to save");
    await this.storage.saveAccounts(this.accounts);
  }

  addAccounts(accounts, save = true) {
    if (!Array.isArray(accounts)) return;

    accounts.forEach((account) => {
      this.addAccount(account, save);
    });
  }

  addAccount(data, save = true) {
    const id = data.id ?? this.generateNextId();
    const account = new Account({ ...data, id });

    this.accounts.push(account);

    if (save) this.save();

    return account;
  }

  generateNextId() {
    const ids = this.accounts.map((item) => item.id);
    return Math.max(...ids, 0) + 1;
  }

  async select(id) {
    const account = this.accounts.find((item) => item.id === id);

    if (!account) return false;
    this.currentAccount = account;
    await this.getSteamAPI()
    return true;
  }

  rename(name) {
    this.currentAccount.rename(name);
    this.save();
  }

  updatePassword(password) {
    this.currentAccount.updatePassword(password);
    this.save();
  }

  updateIdentitySecret(identitySecret) {
    this.currentAccount.updateIdentitySecret(identitySecret);
    this.save();
  }

  updateSharedSecret(sharedSecret) {
    this.currentAccount.updateSharedSecret(sharedSecret);
    this.save();
  }

  updateMarketApiKey(marketApiKey) {
    this.currentAccount.updateMarketApiKey(marketApiKey);
    this.save();
  }

  async saveSession(sessionData) {
    await this.storage.saveAccountSession(
      this.currentAccount.name,
      sessionData,
    );
  }

  async loadSession() {
    return await this.storage.loadAccountSession(this.accountName);
  }

  async getSteamAPI() {
    if (!this.currentAccount.steamAPI) {
      const steamAPI = new SteamAPI(this.currentAccount);

      let session = await this.loadSession();
      const sessionData = await steamAPI.initialize(session);
      sessionData && (await this.saveSession(sessionData));

      this.currentAccount.steamAPI = steamAPI;
    }

    return this.currentAccount.steamAPI;
  }

  remove() {
    this.accounts = this.accounts.filter((item) => item.id != this.id);
    this.currentAccount = null;
    this.save();
  }

  async close() {
    this.accounts.forEach((account) => {
      account.steamAPI && account.steamAPI.close();
    });
  }
}
