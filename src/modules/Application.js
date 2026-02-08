import { AppState } from "./AppState.js";
import { FatalError, NotfoundError, ValidationError } from "./errors/index.js";

export class Application {
  constructor() {
  }

  async init(ctx, view) {
    try {
      await ctx.storage.ensureDir();

      const state = await ctx.storage.loadAppState();
      ctx.setAppState(new AppState(state));

      await ctx.accountManager.load();

      if (ctx.appState.accountId) {
        if (
          !(await ctx.accountManager.select(ctx.appState.accountId))
        ) {
          ctx.appState.setAccountId(null);
        }
      }

      this.setupSubscriptions(ctx, view);
    } catch (err) {
      this.handleError(err);
      await view.getEnter();
    }
  }

  async run(ctx, view) {
    try {
      await this.init(ctx, view);

      while (ctx.isRunning) {
        try {
          // Flow
          if (ctx.activeFlow && !ctx.activeFlow.started) {
            const result = ctx.activeFlow.start();
            ctx.activeFlow.started = true;
            view.showFlowOutput(result);
          }

          if (ctx.activeFlow) {
            const input = await view.getInput();
            const result = ctx.activeFlow.handleInput(input);

            if (result) {
              if (result.message) {
                view.showFlowOutput(result);
              }

              if (result.done) {
                if (result.command) {
                  await result.command.execute(ctx);
                }
                ctx.activeFlow = null;
              }
            }

            continue;
          }

          //Menu
          const menuManager = ctx.menuManager;
          const menu = menuManager.current;
          const items = await menuManager.getItems(ctx);
          await view.showMenu(menu, items, ctx);

          const menuItem = await view.getChoice(items);

          if (menuItem) {
            await menuItem.command.execute(ctx);
          }
        } catch (err) {
          this.handleError(err, ctx, view);
          await view.getEnter();
        }
      }
    } finally {
      await this.shutdown(ctx, view);
    }
  }

  setupSubscriptions(ctx, view) {
    ctx.taskManager.on("update", async () => {
      await this.refreshUI(ctx, view);
    });
  }

  async refreshUI(ctx, view) {
    if (ctx.activeFlow) return;

    const menu = ctx.menuManager.current;
    if (menu?.isDynamic) {
      const items = await ctx.menuManager.getItems(ctx);
      await view.showMenu(menu, items, ctx);
    }
  }

  handleError(err, ctx, view) {
    if (err instanceof FatalError) {
      view.showError(err);
      ctx.isRunning = false;
      return;
    }

    if (err instanceof ValidationError) {
      view.showError(err);
      return;
    }

    if (err instanceof NotfoundError) {
      view.showError(err);
      ctx.setAppState();
      return;
    }

    view.showError(new Error("Unexpected error"));
    ctx.isRunning = false;
    console.error(err);
  }

  async shutdown(ctx, view) {
    await ctx.storage.saveAppState(ctx.appState);
    await view.close();
    await ctx.accountManager.close();
  }
}
