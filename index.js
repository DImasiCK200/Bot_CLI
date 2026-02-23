import { Application } from "./src/modules/Application.js";
import { Context } from "./src/modules/Context.js";
import { BlessedView } from "./src/modules/views/BlessedView.js";
import { MenuManager } from "./src/modules/menu/index.js";
import { NewFileStorage } from "./src/modules/storage/NewFileStorage.js";
import { mainMenu } from "./src/assets/menu/mainMenu.js";

const menuManager = new MenuManager();

menuManager.push(mainMenu);

const baseStorage = new NewFileStorage({});
const storage = baseStorage.forUser("local");
const context = new Context({ storage, menuManager });

const app = new Application(context, new BlessedView());
await app.run();
