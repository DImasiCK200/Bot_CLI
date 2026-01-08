import { Flow } from "./Flow";

export class AddAccountFlow extends Flow {
  constructor() {
    super()
  }

  start(ctx) {
    ctx.view.show
  }

  handleInput(ctx, input) {}

  isFinished() {

  }
}