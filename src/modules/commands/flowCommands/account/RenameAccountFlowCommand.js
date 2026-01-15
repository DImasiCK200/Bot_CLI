import { FlowCommand } from "../../FlowCommand.js";

export class RenameAccountFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.rename(this.data.accountName);
  }
}
