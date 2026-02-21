import { Flow } from "./Flow.js";

export class WizardFlow extends Flow {
  constructor(steps, callback) {
    super();
    this.steps = steps;
    this.callback = callback;
    this.commands = {
      "/cancel": { label: "Cancel", command: this.cancel.bind(this) },
      "/back": { label: "Back", command: this.back.bind(this) },
    };
  }

  ask() {
    return this.newResult(this.steps[this.step].prompt);
  }

  start() {
    this.started = true;
    return this.ask();
  }

  handleInput(input) {
    const commandResult = this.tryCommand(input);
    if (commandResult) return commandResult;

    const step = this.steps[this.step];

    if (step.required && !input) {
      return this.newResult(step.requiredMessage);
    }

    if (input) {
      this.data[step.key] = input;
    }

    this.step++;

    if (this.step >= this.steps.length) {
      return this.finish();
    }

    return this.ask();
  }

  finish() {
    return this.newResult("Done", true);
  }

  cancel() {
    return this.newResult("Cancelled!", true);
  }

  back() {
    if (this.step > 0) {
      this.step--;
    }
    return this.ask();
  }
}
