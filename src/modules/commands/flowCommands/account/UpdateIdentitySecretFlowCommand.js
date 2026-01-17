import { FlowCommand } from "../../FlowCommand.js";

export class UpdateIdentitySecretFlowCommand extends FlowCommand {
  execute(ctx) {
    ctx.accountManager.updateIdentitySecret(this.data.identitySecret);
  }
}
