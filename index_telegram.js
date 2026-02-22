import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";

import { SessionManager } from "./src/modules/SessionManager.js";

const bot = new Bot(process.env.BOT_API_KEY);
const sessionManager = new SessionManager(bot);

// Set command prompt to use in chat(left to text input line)
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

// Handle /start
bot.command("start", async (tgCtx) => {
  const chatId = tgCtx.chat.id;
  const { session } = await sessionManager.createSession(chatId);

  session.start();
});

// Handle /delete
bot.command("delete", async (tgCtx) => {
  const chatId = tgCtx.chat.id;

  sessionManager.deleteSession(chatId);
});

// Handle all text messages
bot.on("message:text", async (tgCtx) => {
  const chatId = tgCtx.chat.id;
  const { session } = sessionManager.getSession(chatId);
  const message = tgCtx.message;
  const input = message.text;

  await tgCtx.api.deleteMessage(message.chat.id, message.message_id);

  session.newMessage(input);
});

// Handle callbackQueries(from inlineKeyboard)
bot.on("callback_query:data", async (tgCtx) => {
  const chatId = tgCtx.chat.id;
  const { session } = sessionManager.getSession(chatId);
  const input = tgCtx.callbackQuery.data;
  await tgCtx.answerCallbackQuery();

  session.newCallbackQuery(input);
});

// Handle errors in bot
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
