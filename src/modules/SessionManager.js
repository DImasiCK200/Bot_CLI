import { UserRuntime } from "./UserRuntime.js";
import { Context } from "./Context.js";
import { MenuManager } from "./menu/index.js";
import { FileStorage } from "./storage/FileStorage.js";
import { mainMenu } from "../assets/menu/mainMenu.js";
import { TelegramView } from "./TelegramView.js";
import { NotfoundError } from "./errors/index.js";
import { SessionEvents } from "./SessionEvents.js";

export class SessionManager {
  constructor(bot) {
    this.bot = bot;
    this.sessions = new Map();
  }

  createSession(chatId) {
    const session = new SessionEvents(chatId);
    const storage = new FileStorage({ subDirs: ["sessions"] });
    const menuManager = new MenuManager();
    menuManager.push(mainMenu);

    const ctx = new Context({ storage, menuManager });
    const view = new TelegramView(this.bot, chatId, null);
    const userRuntime = new UserRuntime(session, ctx, view);

    this.sessions.set(chatId, { session, userRuntime });

    return this.sessions.get(chatId);
  }

  getSession(chatId) {
    return this.sessions.get(chatId);
  }

  deleteSession(chatId) {
    if (this.sessions.has(chatId)) {
      this.sessions.delete(chatId);
    } else {
      throw new NotfoundError("SessionEvents not found");
    }
  }
}
