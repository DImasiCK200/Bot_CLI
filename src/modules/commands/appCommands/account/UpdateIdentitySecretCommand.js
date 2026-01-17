import { UpdateIdentitySecretFlow } from "../../../flow/accountFlow/UpdateIdentitySecretFlow.js";
import { Command } from "../../Command.js";

export class UpdateIdentitySecretCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new UpdateIdentitySecretFlow();
  }
}
