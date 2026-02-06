import SteamCommunity from "steamcommunity";
import TradeOfferManager from "steam-tradeoffer-manager";
import SteamTotp from "steam-totp";
// import { SteamSellAPI } from "./steamSellAPI.js";
import { NotfoundError, ValidationError } from "../errors/index.js";

const isEmpty = (obj) => Object.keys(obj).length === 0;

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

    this.steamCommunity = new SteamCommunity();
    this.tradeManager = null
    // this.steamSellAPI = new SteamSellAPI();

    this._session = session;
  }

  async getNickname() {
    const steamUser = await this._getSteamUserAsync(
      this.steamCommunity.steamID,
    );
    return steamUser ? steamUser.name : null;
  }

  createTradeManagaer() {
    this.tradeManager = new TradeOfferManager({
      community: this.steamCommunity,
    });
  }

  closeTradeManager() {
    this.tradeManager.shutdown()
  }

  setSessionData(session) {
    this.setCookies(session.cookies);
    this.setSessionId(session.sessionId);
  }

  setCookies(cookies) {
    this.steamCommunity.setCookies(cookies);
    // this.tradeManager.setCookies(cookies);
    // this.steamSellAPI.setCookies(cookies);
  }

  setSessionId(sessionId) {
    this.steamCommunity.sessionID = sessionId;
    // this.steamSellAPI.setSessionId(sessionId);
  }

  async initialize(session = null) {
    if (isEmpty(session) === false) {
      this.setSessionData(session);
      if (await this._isSessionValid()) {
        return null;
      }
      this._clearSession();
    }

    const sessionData = await this._loginAsync();

    this.setSessionData(sessionData);
    this.nickname = await this.getNickname();

    return sessionData;
  }

  /**
   * Логинит аккаунт в Steam
   * @returns {Promise<Object|null>} свежую сессию
   */
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

  /**Проверяет жива ли сессия
   * @return {Promise<boolean>}
   */
  _isSessionValid() {
    return new Promise((resolve, reject) => {
      this.steamCommunity.loggedIn((err, loggedIn) => {
        if (err) reject(err);
        resolve(loggedIn);
      });
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

  /**
   * Внутренний метод для очистки ссесии
   * @private
   */
  _clearSession() {
    this.steamCommunity = new SteamCommunity();
    this.tradeManager = null
    // this.steamSellAPI = new SteamSellAPI();
    this._session = null;
  }

  async close() {
    // this.tradeManager.shutdown();
  }
}
