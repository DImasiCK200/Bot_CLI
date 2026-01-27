import { Account } from "./Account.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

import SteamCommunity from "steamcommunity";
import TradeOfferManager from "steam-tradeoffer-manager";
import SteamTotp from "steam-totp";

const MAX_SESSION_AGE = 1000 * 60 * 60 * 24;

export class AccountManager {
  constructor({ storage }) {
    this.accounts = [];
    this.currentAccount = null;

    this.storage = storage;

    this.steamCommunity = null;
    this.sessionData = null;
    this.tradeManafger = null;
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
    this.save();
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
    // this.getSession();
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

  setCookies(cookies) {
    this.steamCommunity.setCookies(cookies);
    this.tradeManager.setCookies(cookies)
  }

  setSessionId(sessionId) {
    this.steamCommunity.sessionID = sessionId;
  }

  setSessionData(session) {
    this.sessionData = session;
  }

  async createSession() {
    const sessionData = await this.loginAsync();

    this.setCookies(sessionData.cookies);
    this.setSessionId(sessionData.sessionID);

    await this.saveSession(sessionData);
  }

  async saveSession(sessionData) {
    await this.storage.saveAccountSession(
      this.currentAccount.name,
      sessionData,
    );
  }

  async loadSession() {
    return await this.storage.loadAccountSession(this.currentAccount.name);
  }

  async tryLoadSession() {
    const session = await this.loadSession();

    if (!session.createdAt) return false;

    const age = Date.now() - session.createdAt;

    if (age > MAX_SESSION_AGE) {
      return false;
    }

    this.setCookies(session.cookies);
    this.setSessionId(session.sessionID);
    this.setSessionData(session);

    return true;
  }

  loginAsync() {
    return new Promise((resolve, reject) => {
      this.steamCommunity.login(
        {
          accountName: this.accountName,
          password: this.password,
          twoFactorCode: SteamTotp.generateAuthCode(this.sharedSecret),
        },
        (loginError, sessionID, cookies, steamguard) => {
          if (loginError) return reject(loginError);
          resolve({ sessionID, cookies, steamguard });
        },
      );
    });
  }

  async getSession() {
    this.steamCommunity = new SteamCommunity();
    this.tradeManager = new TradeOfferManager();
    const sessionLoaded = await this.tryLoadSession();
    if (!sessionLoaded) await this.createSession();
  }

  getSteamUserAsync(steamID) {
    return new Promise((resolve, reject) => {
      this.steamCommunity.getSteamUser(steamID, (err, steamUser) => {
        if (err) reject(new Error(err));
        resolve(steamUser);
      });
    });
  }

  remove() {
    this.accounts = this.accounts.filter((item) => item.id != this.id);
    this.currentAccount = null;
    this.save();
  }
}
