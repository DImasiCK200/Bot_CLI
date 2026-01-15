export class Flow {
  constructor() {
    this.step = 0;
    this.data = {};
    this.started = false;
    this.title = "[BASIC FLOW]";
    this.description = "/cancel - cancel, /back - go to previous page";
    this.commands = {};
  }

  newResult(message, done = false, command = null) {
    return {
      title: this.title,
      description: this.description,
      message,
      done,
      command,
    };
  }

  tryCommand(input) {
    if (!input?.startsWith("/")) return null;
    const cmd = this.commands[input];
    return cmd ? cmd() : null;
  }
}
