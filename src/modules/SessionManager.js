import { Application } from "./Application.js";
import { Context } from "./Context.js";
import { MenuManager } from "./menu/index.js";
import { FileStorage } from "./storage/FileStorage.js";
import { mainMenu } from "../assets/menu/mainMenu.js";
import { TelegramView } from "./TelegramView.js";
import { NotfoundError } from "./errors/index.js";

export class SessionManager {
  constructor(bot) {
    this.bot = bot;
    this.sessions = new Map();
  }

  createSession(chatId) {
    const storage = new FileStorage({ subDirs: ["sessions"] });
    const menuManager = new MenuManager();
    menuManager.push(mainMenu);

    const ctx = new Context({ storage, menuManager });
    const view = new TelegramView(this.bot, chatId, null);
    const app = new Application();

    this.sessions.set(chatId, { app, view, ctx });
  }

  getSession(chatId) {
    if (!this.sessions.has(chatId)) {
      this.createSession(chatId);
    }

    return this.sessions.get(chatId);
  }

  deleteSession(chatId) {
    if (this.sessions.has(chatId)) {
      this.sessions.delete(chatId);
    } else {
      throw new NotfoundError("Session not found");
    }
  }
}
