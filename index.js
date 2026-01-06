import { Application } from "./src/Application.js";
import { Context } from "./src/Context.js";
import { ConsoleView } from "./src/ConsoleView.js";
import { AccountManager } from "./src/account/AccountManager.js";
import { Menu, MenuItem } from "./src/menu/index.js";
import {
  PushMenuCommand,
  BackMenuCommand,
  ExitCommand,
  ChooseAccountCommand,
} from "./src/commands/index.js";

const taskMenu = new Menu({
  title: "Task menu",
  items: [new MenuItem("Back", new BackMenuCommand())],
});

const chooseAccountMenu = new Menu({
  title: "Choose account",
  descriptionFn: (ctx) => `Account: ${ctx.account || "not selected"}`,
  items: [
    new MenuItem("Account_1", new ChooseAccountCommand()),
    new MenuItem("Back", new BackMenuCommand()),
  ],
});

const mainMenu = new Menu({
  title: "Main menu",
  items: [
    new MenuItem("Tasks", new PushMenuCommand(taskMenu)),
    new MenuItem("Choose Account", new PushMenuCommand(chooseAccountMenu)),
    new MenuItem("Exit", new ExitCommand()),
  ],
});

const accounts = [];

const accountManager = new AccountManager(accounts);
const context = new Context({ accountManager });
context.pushMenu(mainMenu);

const app = new Application(context, new ConsoleView());
await app.run();
