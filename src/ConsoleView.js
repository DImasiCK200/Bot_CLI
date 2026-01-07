import readline from "readline";

export class ConsoleView {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  showMenu(menu, items, ctx) {
    console.clear();
    console.log(menu.title);
    console.log(menu.getDescription(ctx));

    items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.label}`);
    });
  }

  showError(err) {
    console.clear();
    console.log("[ERROR]");
    console.log(err.message);
  }

  async getChoice(items) {
    return new Promise((resolve) => {
      this.rl.question("> ", (answer) => {
        const index = Number(answer) - 1;
        resolve(items[index]);
      });
    });
  }

  close() {
    this.rl.close();
    console.log("Readline closed");
  }
}
