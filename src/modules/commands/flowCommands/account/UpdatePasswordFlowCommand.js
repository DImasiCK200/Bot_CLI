import { FlowCommand } from "../../FlowCommand.js";

export class UpdatePasswordFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.updatePassword(this.data.password);
  }
}
