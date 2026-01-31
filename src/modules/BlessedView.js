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

    this.screen.append(this.outputBox);
    this.screen.append(this.inputBox);

    this.inputBox.focus();

    this.screen.key(["C-c"], () => {
      this.close();
      process.exit(0);
    });

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
    let output = "";
    output += `{bold}${menu.title}{/bold}\n`;
    output += `${menu.getDescription(ctx)}\n\n`;

    items.forEach((item, i) => {
      output += `${i + 1}. ${item.label}\n`;
    });

    this.render(output);
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

    const index = Number(value) - 1;
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
