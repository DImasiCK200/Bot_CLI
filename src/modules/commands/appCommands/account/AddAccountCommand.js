import { AddAccountFlow } from "../../../../flow/AddAccountFlow.js";
import { Command } from "../../Command.js";

export class AddAccountCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new AddAccountFlow();
  }
}
