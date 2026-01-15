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
  }

  get name() {
    return this.accountName;
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
}
