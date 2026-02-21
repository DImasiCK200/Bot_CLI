import axios from "axios";

export class SteamSellAPI {
  constructor(community = null) {
    this.baseURL = "https://steamcommunity.com/market";

    if (community) {
      this.setSteamIdByCommunity(community);
    }
  }

  setSteamIdByCommunity(community) {
    this.steamID64 = community.steamID.toString();
  }

  setSession(sessionData) {
    let cookiesString;

    if (Array.isArray(sessionData.cookies)) {
      cookiesString = sessionData.cookies.join("; ");
    } else if (typeof sessionData.cookies === "string") {
      cookiesString = sessionData.cookies;
    } else {
      throw new Error(
        'Cookies must be an array of strings like ["sessionid=...", "steamLoginSecure=..."] or a string',
      );
    }

    // Извлекаем sessionID из куки, если не передан явно
    this.sessionID =
      sessionData.sessionID || this._extractSessionId(cookiesString);

    // Гарантируем наличие sessionid в куках
    if (!cookiesString.includes("sessionid=")) {
      cookiesString += `; sessionid=${this.sessionID}`;
    }

    // Проверяем наличие steamLoginSecure (критично для market)
    if (!cookiesString.includes("steamLoginSecure=")) {
      console.warn(
        "⚠️ steamLoginSecure отсутствует в куках — sellItem и другие действия могут не работать!",
      );
    }

    this.cookiesString = cookiesString;
  }

  initialize(sessionData) {
    this.setSession(sessionData);

    this.defaultHeaders = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      Referer: `https://steamcommunity.com/profiles/${this.steamID64}/inventory/`,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      Cookie: this.cookiesString,
    };

    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 14000,
      headers: this.defaultHeaders,
      transformRequest: [
        (data, headers) => {
          if (!data) return data;

          if (
            headers["content-type"]?.includes("urlencoded") ||
            !headers["content-type"]
          ) {
            const params = new URLSearchParams();
            params.append("sessionid", this.sessionID);

            Object.entries(data).forEach(([key, value]) => {
              if (key !== "sessionid") {
                params.append(key, value?.toString() ?? "");
              }
            });

            return params.toString();
          }

          return data;
        },
      ],
      validateStatus: (status) => status < 500,
    });
  }

  _extractSessionId(cookiesStr) {
    const match = cookiesStr.match(/sessionid=([^;]+)/);
    if (!match) {
      throw new Error(
        'sessionid не найден в куках! Формат: "sessionid=abc123"',
      );
    }
    return match[1];
  }

  priceToInt(priceRub) {
    return Math.round((priceRub * 100) / 1.15);
  }

  async request(endpoint, config = {}) {
    const {
      method = "GET",
      params = {},
      additionalHeaders = {},
      skipSessionIdInBody = false,
    } = config;

    const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    try {
      const response = await this.axios({
        method: method.toUpperCase(),
        url,
        headers: {
          ...this.defaultHeaders,
          ...additionalHeaders,
          Referer: additionalHeaders.Referer || this.defaultHeaders.Referer,
        },
        params: method.toLowerCase() === "get" ? params : undefined,
        data:
          method.toLowerCase() === "post" && !skipSessionIdInBody
            ? params
            : undefined,
      });

      const contentType = response.headers["content-type"] || "";

      // Обработка HTML-ответов (капча/логин)
      if (typeof response.data === "string" && contentType.includes("html")) {
        if (
          response.data.includes("login") ||
          response.data.includes("sign in")
        ) {
          return { success: false, error: "Сессия истекла / не авторизован" };
        }
        if (response.data.includes("captcha")) {
          return {
            success: false,
            error: "Требуется капча — детект автоматизации",
          };
        }
        return {
          success: false,
          error: "Неожиданный HTML-ответ",
          raw: response.data.substring(0, 300),
        };
      }

      const data = response.data;

      if (data?.success === false) {
        const errorMsg = data.message || data.error || "Steam отклонил запрос";
        // Специальная обработка типичных ошибок sellItem
        if (
          errorMsg.includes("problem listing your item") ||
          errorMsg.includes("обновите страницу")
        ) {
          console.warn(
            "⚠️ Возможно, требуется мобильное подтверждение в Steam Guard",
          );
        }
        if (errorMsg.includes("SessionEvents mismatch")) {
          console.warn(
            "⚠️ SessionEvents mismatch — проверьте куки и sessionid",
          );
        }
        return { success: false, error: errorMsg, data };
      }

      return data ?? { success: true };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (
          status === 400 &&
          data?.message?.includes("SessionEvents mismatch")
        ) {
          return {
            success: false,
            error: "SessionEvents mismatch — неверный sessionid или куки",
          };
        }
        if (status === 429) {
          return {
            success: false,
            error: "Rate limit (429) — слишком много запросов",
          };
        }
        console.warn(
          `Steam [${status}]:`,
          data?.message || data || error.message,
        );
        return {
          success: false,
          error: data?.message || "Запрос провалился",
          status,
        };
      }
      console.error("Ошибка запроса:", error.message);
      return { success: false, error: error.message };
    }
  }

  async sellItem(assetid, priceRub, contextid = 2, appid = 730) {
    const price = this.priceToInt(priceRub);

    return this.request("sellitem", {
      method: "POST",
      additionalHeaders: {
        Referer: `https://steamcommunity.com/profiles/${this.steamID64}/inventory/`, // Ключевой для sell
      },
      params: {
        appid: appid.toString(),
        contextid: contextid.toString(),
        assetid: assetid.toString(),
        amount: "1",
        price: price.toString(),
      },
    });
  }

  async buyOrder(
    marketHashName,
    priceRub,
    quantity = 1,
    currency = 5,
    appid = 730,
    confirmation = 0,
  ) {
    const price = this.priceToInt(priceRub);
    return this.request("createbuyorder/", {
      method: "POST",
      additionalHeaders: {
        Referer: `https://steamcommunity.com/market/listings/${appid}/${encodeURIComponent(
          marketHashName,
        )}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", // Только для этого метода
      },
      params: {
        appid: appid.toString(),
        currency: currency.toString(),
        market_hash_name: marketHashName,
        price_total: price.toString(),
        quantity: quantity.toString(),
        billing_state: "", // Пустая строка, как в оригинале
        save_my_address: "0",
        confirmation: confirmation.toString(),
      },
    });
  }

  async getPriceOverview(
    marketHashName,
    country = "RU",
    currency = 5,
    appid = 730,
  ) {
    return this.request("priceoverview/", {
      method: "GET",
      additionalHeaders: {
        Referer: `https://steamcommunity.com/profiles/${this.steamID64}/inventory/`,
      },
      params: {
        country,
        currency: currency.toString(),
        appid: appid.toString(),
        market_hash_name: marketHashName,
      },
    });
  }

  async getPriceHistory(marketHashName, currency = 5, appid = 730) {
    return this.request("pricehistory/", {
      method: "GET",
      additionalHeaders: {
        Referer: `https://steamcommunity.com/market/listings/${appid}/${encodeURIComponent(
          marketHashName,
        )}`,
      },
      params: {
        appid: appid.toString(),
        currency: currency.toString(),
        market_hash_name: marketHashName,
      },
    });
  }

  /**
   * Создаёт buy order с повторными попытками, если требуется подтверждение
   * @param {string} marketHashName
   * @param {number} priceTotalCents - цена в копейках (price_total)
   * @param {number} [quantity=1]
   * @param {number} [currency=5] - 5 = RUB
   * @param {number} [appid=730]
   * @param {object} options
   * @param {number} [options.maxAttempts=20]
   * @param {number} [options.delayMs=4000] - 4 секунды как в браузере
   * @returns {Promise<{success: boolean, data: any, attempts: number}>}
   */
  async createBuyOrderWithRetry(
    marketHashName,
    priceTotalCents,
    quantity = 1,
    currency = 5,
    appid = 730,
    options = {},
  ) {
    const {
      maxAttempts = 25, // ~80–100 секунд максимум
      delayMs = 3000, // 3 секунды — близко к браузеру
    } = options;

    let attempts = 0;
    let lastResult = null;
    let confirmationId = 0;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(
        `Попытка создания buy order #${attempts}/${maxAttempts} для "${marketHashName}"`,
      );

      lastResult = await this.buyOrder(
        marketHashName,
        priceTotalCents,
        quantity,
        currency,
        appid,
        confirmationId,
      );

      // Успех без подтверждения
      if (lastResult?.success === 1) {
        console.log("Buy order создан и активирован сразу!");
        return { success: true, data: lastResult, attempts };
      }

      // Требуется подтверждение — продолжаем повторять
      if (lastResult?.need_confirmation === true) {
        confirmationId = lastResult.confirmation?.confirmation_id || 0;
        console.log(
          `Ожидание подтверждения... (confirmation_id: ${lastResult.confirmation?.confirmation_id})`,
        );
        console.log("Подтвердите в мобильном приложении Steam Guard");

        // Ждём интервал
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // Другие ошибки — выходим
      console.warn("Неожиданный ответ:", lastResult);
      return { success: false, data: lastResult, attempts };
    }

    console.warn(
      `Достигнут лимит попыток (${maxAttempts}). Buy order не активирован.`,
    );
    return { success: false, data: lastResult, attempts };
  }
}
