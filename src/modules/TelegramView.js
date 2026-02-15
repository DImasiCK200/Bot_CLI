export class TelegramView {
  constructor(bot, chatId, tgCtx = null) {
    this.bot = bot;
    this.chatId = chatId;
    this.tgCtx = tgCtx;
    this.inputResolver = null;
    this.waitInput = null; // text, img, file, etc
  }

  setWaitInput(state = null) {
    this.waitInput = state;
  }

  async showMessage(text) {
    await this.bot.api.sendMessage(this.chatId, text);
  }

  async showError(err) {}

  async showFlowOutput(flowResult) {}

  async showMenu(menu, items, ctx) {
    let output = `${menu.title}\n\n`;
    let InlineKeyboard = [];

    const itemsNew = [...items];
    const navItem = itemsNew.shift();
    const desc = await menu.getDescription(ctx);

    output += `${desc}\n\n`;

    itemsNew.forEach((item, i) => {
      InlineKeyboard.push([
        {
          text: item.label,
          callback_data: String(i + 1),
        },
      ]);
    });

    InlineKeyboard.push([
      {
        text: navItem.label,
        callback_data: String(0),
      },
    ]);

    await this.bot.api.sendMessage(this.chatId, output, {
      reply_markup: {
        inline_keyboard: InlineKeyboard,
      },
    });
  }

  submitInput(value) {
    if (!this.inputResolver) return;

    const resolver = this.inputResolver;

    this.inputResolver = null;
    this.setWaitInput(null);

    resolver(value);
  }

  async getInput(type = "text") {
    if (this.inputResolver) {
      throw new Error("Input already pending");
    }

    this.setWaitInput(type);

    return new Promise((resolve) => {
      this.inputResolver = resolve;
    });
  }

  async getChoice(items) {
    const value = await this.getInput("number");

    const index = Number(value);

    if (Number.isNaN(index) || !items[index]) {
      throw new Error("Invalid choice");
    }

    return items[index];
  }

  // async getFile() {
  //   this.setWaitInput("file");
  // }

  // async getImage() {
  //   this.setWaitInput("image");
  // }

  async getEnter() {
    await this.getInput("enter");
  }

  close() {}
}
