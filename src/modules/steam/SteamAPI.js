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
    this.tradeManager = null;
    // this.steamSellAPI = new SteamSellAPI();

    this._session = session;
  }

  async getSteamUser(steamId = this.steamCommunity.steamID) {
    const steamUser = await this._getSteamUserAsync(steamId);
    return steamUser ? steamUser : null;
  }

  async createTradeManagaer() {
    this.tradeManager = new TradeOfferManager({
      community: this.steamCommunity,
      domain: "example.com",
      language: "en",
    });

    await this._setCookiesTradeManagerAsync(this._session.cookies);
  }

  _setCookiesTradeManagerAsync(cookies) {
    return new Promise((resolve, reject) => {
      this.tradeManager.setCookies(cookies, (err) => {
        if (err) reject(new Error(err));

        resolve();
      });
    });
  }

  closeTradeManager() {
    this.tradeManager.shutdown();
  }

  async doWithTradeManager(callback) {
    await this.createTradeManagaer();

    try {
      return await callback();
    } finally {
      this.closeTradeManager();
    }
  }

  setSessionData(session) {
    this.setCookies(session.cookies);
    this.setSessionId(session.sessionId);
    this._session = session;
  }

  setCookies(cookies) {
    this.steamCommunity.setCookies(cookies);
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
        this.steamUser = await this.getSteamUser();
        return null;
      }
      this._clearSession();
    }

    const sessionData = await this._loginAsync();

    this.setSessionData(sessionData);
    this.steamUser = await this.getSteamUser();

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

  _getInventoryAsync(appid = 730, contextid = 2, tradableOnly = true) {
    return new Promise((resolve, reject) => {
      this.tradeManager.getInventoryContents(
        appid,
        contextid,
        tradableOnly,
        (err, inventory, currencies) => {
          if (err) reject(new Error(err));

          resolve({ inventory, currencies });
        },
      );
    });
  }

  async getInventory(appid = 730, contextid = 2, tradableOnly = true) {
    return await this.doWithTradeManager(() =>
      this._getInventoryAsync(appid, contextid, tradableOnly),
    );
  }

  _getOffersAsync(filter = 0) {
    return new Promise((resolve, reject) => {
      this.tradeManager.getOffers(
        TradeOfferManager.EOfferFilter[filter],
        function (err, sent, received) {
          if (err) reject(new Error(err));

          resolve({ sent, received });
        },
      );
    });
  }

  _acceptOfferAsync(offer) {
    return new Promise((resolve, reject) => {
      offer.accept((err, status) => {
        if (err) reject(new Error(err));

        resolve(status);
      });
    });
  }

  async acceptOffer(offer) {
    return await this.doWithTradeManager(() => this._acceptOfferAsync(offer));
  }

  async acceptGoodOffers(offers) {
    let recievedItems = [];

    for (const offer of offers) {
      if (!offer.itemsToGive.length && offer.itemsToReceive.length) {
        if (offer.state === 2) {
          await this._acceptOfferAsync(offer);
          recievedItems.concat(offer.itemsToReceive);
        }
      }
    }

    return recievedItems;
  }

  /**
   * Внутренний метод для очистки ссесии
   * @private
   */
  _clearSession() {
    this.steamCommunity = new SteamCommunity();
    this.tradeManager = null;
    // this.steamSellAPI = new SteamSellAPI();
    this._session = null;
  }

  async close() {
    // this.tradeManager.shutdown();
  }
}
