export class FlowResult {
  constructor({
    title = null,
    description = null,
    message = null,
    data = {},
    step = null,
    done = false,
  }) {
    this.title = title;
    this.description = description;
    this.message = message;
    this.done = done;
    this.data = data;
    this.step = step;
  }
}
