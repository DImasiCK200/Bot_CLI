import { UpdatePasswordFlow } from "../../../flow/accountFlow/UpdatePasswordFlow.js";
import { Command } from "../../Command.js";

export class UpdatePasswordCommand extends Command {
  execute(ctx) {
    ctx.activeFlow = new UpdatePasswordFlow();
  }
}
