import { Command } from "../../Command.js";

export class ChooseTaskCommand extends Command {
  constructor(taskId) {
    super()
    this.taskId = taskId;
  }
  execute(ctx) {
    ctx.taskManager.choose(this.taskId);
  }
}
