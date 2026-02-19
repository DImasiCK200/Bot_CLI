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
    const [navItem, ...rest] = items;

    rest.forEach((item, i) => {
      inlineKeyboard.text(item.label, String(i + 1)).row();
    });

    inlineKeyboard.text(navItem.label, "0").row();

    return inlineKeyboard;
  }

  async showMessage(text) {
    await this.bot.api.sendMessage(this.chatId, text);
  }

  async showError(err) {
    await this.showPage("ERROR", err.message);
  }

  async showFlowOutput(flowResult) {
    const title = flowResult.title;
    let output = `${flowResult.description}\n\n`;
    output += `${flowResult.message}`;

    await this.showPage(title, output);
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

  submitInput(value) {
    if (!this.inputResolver) return;

    const resolver = this.inputResolver;

    this.inputResolver = null;

    resolver(value);
  }

  async getInput() {
    if (this.inputResolver) {
      throw new Error("Input already pending");
    }

    return new Promise((resolve) => {
      this.inputResolver = resolve;
    });
  }

  async getChoice(items) {
    const value = await this.getInput();

    const index = Number(value);

    if (Number.isNaN(index) || !items[index]) {
      throw new Error("Invalid choice");
    }

    return items[index];
  }

  // async getFile() {
  // }

  // async getImage() {
  // }

  async getEnter() {
    await this.getInput();
  }

  close() {}
}
