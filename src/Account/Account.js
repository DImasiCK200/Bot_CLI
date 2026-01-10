import SteamCommunity from "steamcommunity";
import SteamTotp from "steam-totp";

export class Account {
  constructor({
    id,
    accountName,
    password,
    sharedSecret,
    identitySecret,
    marketApiKey,
  }) {
    this.id = id;
    this.accountName = accountName;
    this.password = password;
    this.sharedSecret = sharedSecret;
    this.identitySecret = identitySecret;
    this.marketApiKey = marketApiKey;

    this.steamCommunity = new SteamCommunity();
    this.session = null;
    this.tradeManager;
  }

  get name() {
    return this.accountName;
  }

  setSession(session) {
    this.session = session;
  }

  setCookies(cookies) {
    this.steamCommunity.setCookies(cookies)
  }

  setSessionId(sessionId) {
    this.steamCommunity.sessionID = sessionId
  }

  rename(name) {
    this.accountName = name;
  }

  updatePassword(password) {
    this.password = password;
  }

  updateSharedSecret(sharedSecret) {
    this.sharedSecret = sharedSecret;
  }

  updateIdentitySecret(identitySecret) {
    this.identitySecret = identitySecret;
  }

  updateMarketApiKey(marketApiKey) {
    this.marketApiKey = marketApiKey;
  }

  updateCookie(cookie) {
    this.cookie = cookie;
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
        }
      );
    });
  }

  getSteamUserAsync(steamID) {
    return new Promise((resolve, reject) => {
      this.steamCommunity.getSteamUser(steamID, (err, steamUser) => {
        if (err) reject(new Error(err));
        resolve(steamUser);
      });
    });
  }
}
