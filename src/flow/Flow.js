export class Flow {
  constructor() {
    this.step = 0;
    this.data = {};
    this.title = "[BASIC FLOW]"
    this.description = 'Press Enter - skip, enter "/cancel" - cancel [BASIC DESCRIPTION]';
  }
  start(ctx) {}
  handleInput(ctx, input) {}
  isFinished() {
    return false;
  }
}
