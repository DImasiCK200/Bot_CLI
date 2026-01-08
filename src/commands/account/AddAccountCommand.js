import { AddAccountFlow } from "../../flow/AddAccountFlow.js";
import { Command } from "../Command.js";

export class AddAccountCommand extends Command {
  execute(ctx) {
    const flow = new AddAccountFlow()
    ctx.activeFlow = flow
    flow.start(ctx)
  }
}
