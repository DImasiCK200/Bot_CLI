import { UserRuntime } from "./src/modules/UserRuntime.js";
import { Context } from "./src/modules/Context.js";
import { ConsoleView } from "./src/modules/ConsoleView.js";
import { BlessedView } from "./src/modules/BlessedView.js";
import { MenuManager } from "./src/modules/menu/index.js";
import { FileStorage } from "./src/modules/storage/FileStorage.js";
import { mainMenu } from "./src/assets/menu/mainMenu.js";

const menuManager = new MenuManager();

menuManager.push(mainMenu);

const storage = new FileStorage({ subDirs: ["sessions"] });
const context = new Context({ storage, menuManager });

const app = new UserRuntime(context, new ConsoleView());
await app.run();
