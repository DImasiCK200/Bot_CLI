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

    this.session;
    this.cookie;
    this.tradeManager;
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

  createSession() {
    try {
    } catch (err) {}
  }
}
