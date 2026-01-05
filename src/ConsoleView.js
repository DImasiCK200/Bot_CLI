import readline from "readline";

export class ConsoleView {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  showMenu(menu, ctx) {
    console.clear();
    console.log(menu.title);
    console.log(menu.getDescription(ctx));
    menu.items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.label}`);
    });
  }

  async getChoice(menu) {
    return new Promise((resolve) => {
      this.rl.question("> ", (answer) => {
        const index = Number(answer) - 1;
        resolve(menu.items[index]);
      });
    });
  }

  close() {
    this.rl.close();
    console.log("Readline is closed");
  }
}
