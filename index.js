import { Application } from "./src/Application.js";
import { Context } from "./src/Context.js";
import { ConsoleView } from "./src/ConsoleView.js";
import { AccountManager } from "./AccountManager.js";
import { Menu, MenuItem } from "./src/menu/index.js";
import {
  PushMenuCommand,
  BackMenuCommand,
  ExitCommand,
  ChooseAccountCommand,
} from "./src/commands/index.js";

const mainMenu = new Menu("Main menu");
const taskMenu = new Menu("Task menu");
const chooseAccountMenu = new Menu(
  "Choose account",
  (ctx) => `Account: ${ctx.account || "not selected"}`,
  [
    new MenuItem("Account_1", new ChooseAccountCommand()),
    new MenuItem("Back", new BackMenuCommand()),
  ]
);

chooseAccountMenu.items = [
  new MenuItem("Account_1", new ChooseAccountCommand()),
  new MenuItem("Back", new BackMenuCommand()),
];

mainMenu.items = [
  new MenuItem("Tasks", new PushMenuCommand(taskMenu)),
  new MenuItem("Choose Account", new PushMenuCommand(chooseAccountMenu)),
  new MenuItem("Exit", new ExitCommand()),
];

taskMenu.items = [new MenuItem("Back", new BackMenuCommand())];

const accounts = [];

const accountManager = new AccountManager(accounts);
const context = new Context({ accountManager });
context.pushMenu(mainMenu);

const app = new Application(context, new ConsoleView());
await app.run();
