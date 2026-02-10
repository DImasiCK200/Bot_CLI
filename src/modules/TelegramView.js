export class TelegramView {
  constructor(bot, chatId, tgCtx) {
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
    await this.bot.sendMessage(this.chatId, text);
  }

  async showError(err) {}

  async showFlowOutput(flowResult) {}

  async showMenu(menu, items, ctx) {}

  submitInput(text) {}

  async getInput() {
    this.waitInput || this.setWaitInput("text");
  }

  async getChoice(items) {
    this.setWaitInput("number");
  }

  // async getFile() {
  //   this.setWaitInput("file");
  // }

  // async getImage() {
  //   this.setWaitInput("image");
  // }

  async getEnter() {
    this.setWaitInput("enter");
  }

  close() {}
}
