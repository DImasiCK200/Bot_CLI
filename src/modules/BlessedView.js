import blessed from "blessed";
import { ValidationError } from "./errors/index.js";

export class BlessedView {
  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Bot CLI",
    });

    // ===== OUTPUT =====
    this.outputBox = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%-3",
      scrollable: true,
      alwaysScroll: true,
      border: "line",
      label: "Output",
      tags: true,
    });

    // ===== INPUT =====
    this.inputBox = blessed.textbox({
      bottom: 0,
      left: 0,
      width: "100%",
      height: 3,
      border: "line",
      label: "Input",
      inputOnFocus: true,
      keys: true, // ← важно
    });

    this.inputBox.key(["up"], () => {
      this.outputBox.scroll(-1);
      this.screen.render();
    });

    this.inputBox.key(["down"], () => {
      this.outputBox.scroll(1);
      this.screen.render();
    });

    this.outputBox.style = {
      border: {
        fg: "#31ad00ff",
      },
    };

    this.screen.append(this.outputBox);
    this.screen.append(this.inputBox);

    this.screen.key(["C-c"], () => {
      this.close();
      process.exit(0);
    });

    this.screen.render();
  }

  showPage({ title, content }) {
    let output = `{bold}${title}{/bold}\n\n`;

    output += Array.isArray(content) ? content.join("\n") : content;

    this.outputBox.setContent(output);
    this.screen.render();
  }

  render(text) {
    this.outputBox.setContent(text);
    this.screen.render();
  }

  showMessage(message) {
    this.outputBox.pushLine(message);
    this.outputBox.setScrollPerc(100);
    this.screen.render();
  }

  showMenu(menu, items, ctx) {
    const itemsNew = [...items];
    const navItem = itemsNew.shift();

    const lines = [];

    lines.push(menu.getDescription(ctx));
    lines.push("");

    itemsNew.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.label}`);
    });

    lines.push("");
    lines.push(`0. ${navItem.label}`);

    this.showPage({
      title: menu.title,
      content: lines,
    });
  }

  showFlowOutput(flowResult) {
    let output = "";
    output += `{bold}[${flowResult.title}]{/bold}\n`;
    output += `${flowResult.description}\n\n`;
    output += `${flowResult.message}`;

    this.render(output);
  }

  showError(err) {
    this.render(`{red-fg}[ERROR]{/red-fg}\n${err.message}`);
  }

  async getChoice(items) {
    const value = await this.getInput();

    const index = value;
    if (Number.isNaN(index) || index < 0 || !items[index]) {
      throw new ValidationError("Wrong menu choice");
    }

    return items[index];
  }

  async getInput() {
    return new Promise((resolve) => {
      this.inputBox.focus();

      const handler = (value) => {
        this.inputBox.removeListener("submit", handler);

        this.inputBox.clearValue();
        this.screen.render();

        resolve(value);
      };

      this.inputBox.once("submit", handler);
    });
  }

  async getEnter() {
    return this.getInput();
  }

  close() {
    this.screen.destroy();
  }
}
