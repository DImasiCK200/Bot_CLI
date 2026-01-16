import { Application } from "./src/modules/Application.js";
import { Context } from "./src/modules/Context.js";
import { ConsoleView } from "./src/modules/ConsoleView.js";
import { AccountManager } from "./src/modules/account/index.js";
import { MenuManager } from "./src/modules/menu/index.js";
import { FileStorage } from "./src/modules/storage/FileStorage.js";
import { mainMenu } from "./src/assets/menu/mainMenu.js";

const menuManager = new MenuManager();

menuManager.push(mainMenu);

const storage = new FileStorage({ subDirs: ["sessions"] });
const accountManager = new AccountManager({ storage });
const context = new Context({ accountManager, storage, menuManager });

const app = new Application(context, new ConsoleView());
await app.run();
