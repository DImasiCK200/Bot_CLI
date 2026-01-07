import { Application } from "./src/Application.js";
import { Context } from "./src/Context.js";
import { ConsoleView } from "./src/ConsoleView.js";
import { AccountManager } from "./src/account/index.js";
import { Menu, MenuItem, MenuManager } from "./src/menu/index.js";
import { FileStorage } from './src/storage/FileStorage.js'
import {
  PushMenuCommand,
  SelectAccountCommand,
} from "./src/commands/index.js";

const menuManager = new MenuManager()

const taskMenu = new Menu({
  title: "Task menu",
});

const chooseAccountMenu = new Menu({
  title: "Choose account",
  descriptionFn: (ctx) => `Account: ${ctx.accountManager.currentAccount?.accountName ?? "not selected"}`,
  itemsFn: (ctx) => {
    const items = ctx.accountManager.accounts.map(
      (account) => new MenuItem(account.accountName, new SelectAccountCommand(account.id))
    );

    return items;
  },
});

const mainMenu = new Menu({
  title: "Main menu",
  itemsFn: (ctx) => [
    new MenuItem("Tasks", new PushMenuCommand(taskMenu)),
    new MenuItem("Choose Account", new PushMenuCommand(chooseAccountMenu)),
  ],
});

menuManager.push(mainMenu)

const storage = new FileStorage()
const accountManager = new AccountManager({ storage });
const context = new Context({ accountManager, storage, menuManager });

const app = new Application(context, new ConsoleView());
await app.run();
