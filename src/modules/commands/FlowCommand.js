export class FlowCommand {
  constructor(data) {
    this.data = data;
  }

  execute(ctx) {
    throw new Error("Not implemented");
  }
}
