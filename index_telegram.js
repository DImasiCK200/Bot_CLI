import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard, session } from "grammy";
import { PsqlAdapter } from "@grammyjs/storage-psql";

import { SessionManager } from "./src/modules/SessionManager.js";

const bot = new Bot(process.env.BOT_API_KEY);
const sessionManager = new SessionManager(bot);

bot.api.setMyCommands([
  {
    command: "/start",
    description: "Запустить/перезапустить бота",
  },
  {
    command: "/delete",
    description: "Стереть данные, связанные с вашим телеграмм аккаунтом",
  },
]);

bot.command("start", async (tgCtx) => {
  const chatId = tgCtx.chat.id;
  const userRuntime = sessionManager.createSession(chatId);

  userRuntime.run();
});

bot.command("delete", async (tgCtx) => {
  const chatId = tgCtx.chat.id;

  sessionManager.deleteSession(chatId);
});

bot.on("message:text", async (tgCtx) => {
  
});

bot.on("callback_query:data", async (tgCtx) => {
  const chatId = tgCtx.chat.id;
  const userRuntime = sessionManager.getSession(chatId);
  const input = tgCtx.callbackQuery.data;

  // session.emit("callback_query", input);



  userRuntime.view.waitInput && userRuntime.view.submitInput(input);

});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Unknown error:", e);
  }
});

//Launch bot
bot.start();
console.log("Bot successfully launched!");
