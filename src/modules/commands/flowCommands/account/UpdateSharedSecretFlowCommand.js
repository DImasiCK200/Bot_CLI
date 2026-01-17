import { FlowCommand } from "../../FlowCommand.js";

export class UpdateSharedSecretFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.updateSharedSecret(this.data.sharedSecret);
  }
}
