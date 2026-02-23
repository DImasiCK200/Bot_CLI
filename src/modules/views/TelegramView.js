import { InlineKeyboard } from "grammy";

export class TelegramView {
  constructor(bot, chatId) {
    this.bot = bot;
    this.chatId = chatId;

    this.lastMessageId = null;
    this.lastMessage = null;
  }

  createKeyboard({ navItems, items }) {
    let inlineKeyboard = new InlineKeyboard();

    if (items) {
      items.forEach((item, i) => {
        inlineKeyboard
          .text(item.label, String(item.callbackQuery ? item.callbackQuery : i))
          .row();
      });
    }

    if (navItems) {
      navItems.forEach((item, i) => {
        inlineKeyboard.text(
          item.label,
          String(item.callbackQuery ? item.callbackQuery : i),
        );
      });
    }

    return inlineKeyboard;
  }

  async sendMessage(title, message) {
    let output = `${title}\n`;
    output += message;

    const keyboard = new InlineKeyboard();
    keyboard.text("OK", "!delete");

    const options = {};

    if (keyboard) {
      options.reply_markup = keyboard;
    }

    await this.bot.api.sendMessage(this.chatId, output, options);
  }

  async sendError(err) {
    await this.sendMessage("ERROR", err.message);
  }

  async showFlowOutput(flowResult) {
    const title = flowResult.title;
    const items = flowResult.items;
    const navItems = flowResult.navItems;
    let output = ``;

    if (flowResult.description) output += `${flowResult.description}\n\n`;
    output += `${flowResult.message}`;

    const keyboard = this.createKeyboard({ navItems, items });

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
      this.lastMessage = content;
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
    const itemsStrLabels = items.map((i) => i.label).join(" ");

    if (
      this.lastMessage?.msg === desc &&
      this.lastMessage?.itemsLabels === itemsStrLabels
    )
      return;

    const keyboard = this.createKeyboard({ items });

    const msg = await this.showPage(title, desc, keyboard);
    this.lastMessage = {
      msg: desc,
      itemsLabels: itemsStrLabels,
    };

    this.lastMessageId = msg.message_id;
  }

  async deleteMessage(tgCtx) {
    const message = tgCtx.callbackQuery.message;

    await tgCtx.api.deleteMessage(message.chat.id, message.message_id);
  }

  close() {}
}
