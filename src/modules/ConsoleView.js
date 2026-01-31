import readline from "readline";
import { ValidationError } from "./errors/index.js";

export class ConsoleView {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.lastRender = "";
  }

  render(text) {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);

    process.stdout.write(text);
    this.lastRender = text;
  }

  showMessage(message) {
    console.log(message);
  }

  showFlowOutput(flowResult) {
    console.clear();
    console.log("[Title]:", flowResult.title);
    console.log("[Desc]:", flowResult.description);
    console.log("[Message]:", flowResult.message);
  }

  showMenu(menu, items, ctx) {
    let stop = false;

    const render = () => {
      let output = "";
      output += `${menu.title}\n`;
      output += `${menu.getDescription(ctx)}\n\n`;

      items.forEach((item, i) => {
        output += `${i + 1}. ${item.label}\n`;
      });

      this.render(output);
    };

    render();

    if (!menu.isDynamic) return;

    const interval = setInterval(() => {
      if (ctx.menuManager.current !== menu || ctx.activeFlow) {
        clearInterval(interval);
        return;
      }
      render();
    }, 300);
  }

  showError(err) {
    console.clear();
    console.log("[ERROR]");
    console.log(err.message);
  }

  async getChoice(items) {
    return new Promise((resolve, reject) => {
      this.rl.question("> ", (answer) => {
        if (!Number(answer))
          return reject(new ValidationError("Input must be Number > 0"));
        const index = Number(answer) - 1;
        resolve(items[index]);
      });
    });
  }

  async getEnter() {
    return new Promise((resolve) => {
      this.rl.question("Press Enter to continue..", () => resolve());
    });
  }

  async getInput() {
    return new Promise((resolve) => {
      this.rl.question("> ", (answer) => {
        resolve(answer);
      });
    });
  }

  close() {
    this.rl.close();
    console.log("Readline closed");
  }
}
