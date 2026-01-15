import { Command } from "../../Command.js";

export class ExitCommand extends Command {
  execute(ctx) {
    ctx.isRunning = false;
  }
}
