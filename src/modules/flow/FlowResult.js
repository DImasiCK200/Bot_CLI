export class FlowResult {
  constructor({
    title = null,
    description = null,
    message = null,
    done = false,
    command = null,
  }) {
    this.title = title;
    this.description = description;
    this.message = message;
    this.done = done;
    this.command = command
  }
}
