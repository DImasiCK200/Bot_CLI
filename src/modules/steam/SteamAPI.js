import SteamCommunity from "steamcommunity";
import TradeOfferManager from "steam-tradeoffer-manager";
import SteamTotp from "steam-totp";
import { SteamSellAPI } from "./steamSellAPI.js";

export class SteamAPI {
  constructor({
    session,
    accountName,
    password,
    sharedSecret,
    identitySecret,
  }) {
    this.accountName = accountName;
    this.password = password;
    this.sharedSecret = sharedSecret;
    this.identitySecret = identitySecret;

    this.session = session;

    this.steamCommunity = new SteamCommunity();
    this.tradeManager = new TradeOfferManager();
    this.steamSellAPI = new SteamSellAPI();
  }

  setSessionData(session) {
    this.setCookies(session.cookies);
    this.setSessionId(session.sessionId);
  }

  setCookies(cookies) {
    this.steamCommunity.setCookies(cookies);
    this.tradeManager.setCookies(cookies);
    this.steamSellAPI.setCookies(cookies);
  }

  setSessionId(sessionId) {
    this.steamCommunity.sessionID = sessionId;
    this.steamSellAPI.setSessionId(sessionId);
  }

  async login() {
    const sessionData = await this._loginAsync();

    this.setSessionData(sessionData);

    return sessionData;
  }

  _loginAsync() {
    return new Promise((resolve, reject) => {
      this.steamCommunity.login(
        {
          accountName: this.accountName,
          password: this.password,
          twoFactorCode: SteamTotp.generateAuthCode(this.sharedSecret),
        },
        (loginError, sessionID, cookies, steamguard) => {
          if (loginError)
            return reject(
              new ValidationError("Login failled, check account data!"),
            );
          resolve({ sessionID, cookies, steamguard });
        },
      );
    });
  }

  _getSteamUserAsync(steamID) {
    return new Promise((resolve, reject) => {
      this.steamCommunity.getSteamUser(steamID, (err, steamUser) => {
        if (err) reject(new Error(err));
        resolve(steamUser);
      });
    });
  }

  async close() {
    this.tradeManager.shutdown();
  }
}
