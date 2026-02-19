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

    newMessage(text) {
        this.emit("message", text)
    }

    newCallbackQuery(text) {
        this.emit("callbackQuery", text)
    }
}