import { InlineKeyboard } from "grammy";

export class TelegramView {
  constructor(bot, chatId) {
    this.bot = bot;
    this.chatId = chatId;
    this.inputResolver = null;
    this.lastMessageId = null;
  }

  createKeyboard(items) {
    let inlineKeyboard = new InlineKeyboard();

    items.forEach((item, i) => {
      inlineKeyboard
        .text(item.label, String(item.callbackQuery ? item.callbackQuery : i))
        .row();
    });

    return inlineKeyboard;
  }

  async sendMessage(title, message) {
    let output = `${title}\n`;
    output += message;

    await this.bot.api.sendMessage(this.chatId, output);
  }

  async sendError(err) {
    await this.sendMessage("ERROR", err.message);
  }

  async showFlowOutput(flowResult) {
    const title = flowResult.title;
    const items = flowResult.items;
    let output = ``;

    if (flowResult.description) output += `${flowResult.description}\n\n`;
    output += `${flowResult.message}`;

    const keyboard = this.createKeyboard(items);

    await this.showPage(title, output, keyboard);
  }

  async showPage(title, content, keyboard = null) {
    let output = `${title}\n\n`;
    output += Array.isArray(content) ? content.join("\n") : content;

    const options = {};

    if (keyboard) {
      options.reply_markup = keyboard;
    }

    if (this.lastMessageId) {
      return await this.bot.api.editMessageText(
        this.chatId,
        this.lastMessageId,
        output,
        options,
      );
    }

    return await this.bot.api.sendMessage(this.chatId, output, options);
  }

  async showMenu(menu, items, ctx) {
    const title = menu.title;
    const desc = await menu.getDescription(ctx);

    const keyboard = this.createKeyboard(items);

    const msg = await this.showPage(title, desc, keyboard);
    this.lastMessageId = msg.message_id;
  }

  close() {}
}
