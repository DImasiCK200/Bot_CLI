import { Application } from "./src/Application.js";
import { Context } from "./src/Context.js";
import { ConsoleView } from "./src/ConsoleView.js";
import { AccountManager } from "./src/account/index.js";
import { MenuManager } from "./src/menu/index.js";
import { FileStorage } from "./src/storage/FileStorage.js";
import { mainMenu } from "./menu/mainMenu.js";

const menuManager = new MenuManager();

menuManager.push(mainMenu);

const storage = new FileStorage({ subDirs: ["sessions"] });
const accountManager = new AccountManager({ storage });
const context = new Context({ accountManager, storage, menuManager });

const app = new Application(context, new ConsoleView());
await app.run();
