export class Flow {
  constructor() {
    this.step = 0
    this.data = {}
  }
  start(ctx) {}
  handleInput(ctx, input) {}
  isFinished() {
    return false;
  }
}
