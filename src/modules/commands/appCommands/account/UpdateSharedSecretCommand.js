import { UpdateSharedSecretFlow } from "../../../flow/accountFlow/UpdateSharedSecretFlow.js";
import { Command } from "../../Command.js";

export class UpdateSharedSecretCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new UpdateSharedSecretFlow();
  }
}
