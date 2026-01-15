import { RenameAccountFlow } from "../../../../flow/RenameAccountFlow.js";
import { Command } from "../../Command.js";

export class RenameAccountCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new RenameAccountFlow();
  }
}
