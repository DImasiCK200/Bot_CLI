import { Command } from "../../Command.js";

export class CancelTaskCommand extends Command {
  constructor(taskId) {
    super();
    this.taskId = taskId;
  }
  execute(ctx) {
    ctx.taskManager.cancel(this.taskId);
  }
}
