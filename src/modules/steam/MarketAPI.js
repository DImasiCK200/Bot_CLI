import { log } from "console";
import axios from "axios";
import { sleep } from "./utils.js";

const age = 60 * 5 * 1000;

const createItems = (itemIds, prices, transformPrice = (p) => p * 100) => {
  if (!Array.isArray(itemIds) || !Array.isArray(prices)) {
    throw new Error("itemIds и prices должны быть массивами");
  }

  if (itemIds.length !== prices.length) {
    throw new Error(
      `Массивы itemIds и prices разной длины: ${itemIds.length} !== ${prices.length}`
    );
  }

  return itemIds.map((id, i) => ({
    item_id: id,
    price: transformPrice(prices[i]),
  }));
};

const countBy = (array, param) => {
  return array.reduce((acc, item) => {
    const name = item[param];

    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
};

export class MarketAPI {
  constructor(key, age = 5 * 60 * 1000, delay = 500) {
    this.key = key;
    this.age = age;
    this.delay = delay;
    this.domain = "https://market.csgo.com/api/v2";

    this.balance = undefined;
    this.inventory = undefined;
    this.itemsBuffer = undefined;
  }

  async request(endpoint, params = {}, method = "get") {
    try {
      console.log("Ожидание:", endpoint);

      const { data } = await axios[method](`${this.domain}${endpoint}`, {
        params: { key: this.key, ...params },
      });

      if (
        Object.prototype.hasOwnProperty.call(data, "success") &&
        !data.success
      )
        throw new Error(data.error);
      return data;
    } catch (err) {
      console.error(`Ошибка запроса ${endpoint}:`, err.message);
      return null;
    }
  }

  async withCurrencyRequest(endpoint, params) {
    const balance = await this.getBalance();
    return this.request(endpoint, {
      ...params,
      cur: balance.currency,
    });
  }

  async getCached(field, updateFn) {
    const cache = this[field];
    if (!cache || Date.now() - cache.lastUpdate > this.age) {
      
      await updateFn.call(this);
    }
    return this[field];
  }

  //Balance
  async updateBalance() {
    const { success, ...data } = await this.request("/get-money");
    if (!data) return;

    this.balance = {
      ...data,
      lastUpdate: Date.now(),
    };
  }

  getBalance() {
    return this.getCached("balance", this.updateBalance);
  }

  async getMoney() {
    return (await this.getBalance()).money;
  }

  //Inventory
  async updateInventory(language = "en") {
    const data = await this.request("/my-inventory", { lang: language });
    if (!data) return;

    this.inventory = {
      items: data.items,
      lastUpdate: Date.now(),
    };
  }

  getInventory() {
    return this.getCached("inventory", this.updateInventory);
  }

  // Item Buffer
  async updateItemsBuffer() {
    const data = await this.request("/items");
    if (!data) return;

    this.itemsBuffer = {
      items: data.items,
      lastUpdate: Date.now(),
    };
  }

  getItemsBuffer() {
    return this.getCached("itemsBuffer", this.updateItemsBuffer);
  }

  //Inventory status
  async updateInventoryStatus() {
    const data = await this.request("/inventory-status");
    if (!data) return;

    return data;
  }

  priceToInt(price) {
    return Math.round(price * 100);
  }

  //Sell items
  sellOneItem(id, price) {
    return this.withCurrencyRequest("/add-to-sale", {
      id,
      price: this.priceToInt(price),
    });
  }

  sellSomeItems(itemIds, prices) {
    const items = createItems(itemIds, prices);
    return this.withCurrencyRequest("/mass-add-to-sale", {
      items: JSON.stringify(items),
    });
  }

  //Change prices
  setOneNewPrice(id, price) {
    return this.withCurrencyRequest("/set-price", {
      id,
      price: this.priceToInt(price),
    });
  }

  setSomeNewPrice(itemIds, prices) {
    const items = createItems(itemIds, prices, this.priceToInt);
    return this.withCurrencyRequest("/mass-set-price", {
      items: JSON.stringify(items),
    });
  }

  setNewPriceByHashName(hash, price) {
    return this.withCurrencyRequest("/mass-set-price-mhn", {
      marketHashName: hash,
      price: this.priceToInt(price),
    });
  }

  //Cancel sell
  cancelSellByHashName(hash) {
    return this.setNewPriceByHashName(hash, 0);
  }

  cancelSell(itemIds) {
    return this.sellSomeItems(
      itemIds,
      itemIds.map(() => 0)
    );
  }

  cancelAllSell() {
    return this.request("/remove-all-from-sale");
  }

  //Enable sell
  enableSells(accessToken) {
    return this.request("/ping-new", { accessToken });
  }

  //Trade requests
  tradeTake() {
    return this.request("/trade-request-take");
  }

  tradeGive() {
    return this.request("/trade-request-give");
  }

  tradeGiveP2P() {
    return this.request("/trade-request-give-p2p");
  }

  tradeGiveP2PAll() {
    return this.request("/trade-request-give-p2p-all");
  }

  tradeRegistration(tradeOfferId) {
    return this.request("/trade-ready", {
      tradeoffer: tradeOfferId,
    });
  }

  getTrades(extended) {
    return this.request("/trades", {
      extended: extended,
    });
  }

  buyItem({ marketHashName, id, price, customId }) {
    return this.request("/buy", {
      price: this.priceToInt(price),
      ...(customId && { custom_id: customId }),
      ...(marketHashName ? { hash_name: marketHashName } : { id }),
    });
  }

  async buyItemMass({ marketHashName, id, price, customId }, quantity) {
    const promises = [];
    let counter = 1;
    let money = await this.getMoney()

    while (quantity > 0 && money > price) {
      const promise = this.buyItem({ marketHashName, id, price, customId })
        .then((res) => {
          console.log(`[${counter++}] выполнено`, res);
        })
        .catch((err) => {
          console.log(`[${counter++}] ошибка`, err?.message || err);
        });
      quantity -= 1;
      this.balance.money -= price;
      promises.push(promise)
      await sleep(this.delay)
    }

    await Promise.allSettled(promises);
    console.log("Все куплено");
    
  }

  buyFor({ marketHashName, id, price, partner, token, chance, customId }) {
    return this.request("/buy-for", {
      price: this.priceToInt(price),
      partner,
      token,
      ...(customId && { custom_id: customId }),
      ...(chance && { chance_to_transfer: chance }),
      ...(marketHashName ? { hash_name: marketHashName } : { id }),
    });
  }

  getBuyInfo(customId) {
    return this.request("/get-buy-info-by-custom-id", {
      custom_id: customId,
    });
  }

  history(date, dateEnd) {
    return this.request("/history", {
      date,
      date_end: dateEnd,
    });
  }

  historyAdvanced(date, dateEnd) {
    return this.request("/operation-history", {
      date,
      date_end: dateEnd,
    });
  }

  getListItemsInfo(listItems) {
    return this.request("/get-list-items-info", {
      list_hash_name: listItems,
    });
  }

  getBidAsk(marketHashName) {
    return this.request("/bid-ask", {
      hash_name: marketHashName,
    });
  }

  test() {
    return this.request("/test");
  }

  // Передача денег на другой аккаунт
  moneySend({ amount, partnerKey, payPass }) {
    return this.request(`/money-send/${this.priceToInt(amount)}/${partnerKey}`, {
      pay_pass: payPass,
    })
  }
}

const main = async () => {
  const itemIds = [1, 2, 3, 4, 5];
  const prices = [110, 120, 130, 140, 150];
  const listItems = [
    "M4A1-S | Black Lotus (Field-Tested)",
    "AWP | Ice Coaled (Battle-Scarred)",
  ];

  const key = "aXh729SocCtGlfWDOg2N5c899C7gvTg";
  const api = new MarketAPI(key);

  // const balance = await api.getBalance();
  // const inventory = await api.getInventory();

  // console.log("--------------");

  // console.log(`Баланс: ${balance.money} ${balance.currency}`);
  // console.log("Инвентарь:");

  // const result = countBy(inventory.items, "market_hash_name");
  // console.log(result);
  console.table(await api.getBalance())

  // log(await api.buyItemMass({ marketHashName: "Fever Case", price: 60}, 98));
};

// main()

export { MarketAPI };
