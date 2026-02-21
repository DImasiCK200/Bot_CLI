import EventEmitter from "events";

export class SessionEvents extends EventEmitter {
  constructor(chatId) {
    super();
    this.chatId = chatId;
  }

  start() {
    this.emit("start");
  }

  close() {
    this.emit("close");
  }

  newMessage(text, tgCtx) {
    this.emit("message", text, tgCtx);
  }

  newCallbackQuery(text, tgCtx) {
    this.emit("callbackQuery", text, tgCtx);
  }
}
