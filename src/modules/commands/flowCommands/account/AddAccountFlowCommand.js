import { FlowCommand } from "../../FlowCommand.js";

export class AddAccountFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.addAccount(this.data);
  }
}
