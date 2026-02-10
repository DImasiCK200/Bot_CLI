// import "dotenv/config";
// import { Bot, GrammyError, HttpError, InlineKeyboard, session } from "grammy";
// import { PsqlAdapter } from "@grammyjs/storage-psql";

// import { Application } from "./src/modules/Application.js";
// import { Context } from "./src/modules/Context.js";
// import { MenuManager } from "./src/modules/menu/index.js";
// import { FileStorage } from "./src/modules/storage/FileStorage.js";
// import { mainMenu } from "./src/assets/menu/mainMenu.js";

// const menuManager = new MenuManager();

// menuManager.push(mainMenu);

// const storage = new FileStorage({ subDirs: ["sessions"] });
// const context = new Context({ storage, menuManager });

// const app = new Application(context, new BlessedView());
// await app.run();

const bot = new Bot(process.env.BOT_API_KEY);

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

bot.command("start", async (ctx) => {});

bot.command("delete", async (ctx) => {});

bot.on("message", async (ctx) => {});

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
