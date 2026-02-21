export class FlowResult {
  constructor({
    title = null,
    description = null,
    items = null,
    navItems = null,
    message = null,
    done = false,
    command = null,
  }) {
    this.title = title;
    this.description = description;
    this.items = items;
    this.navItems = navItems;
    this.message = message;
    this.done = done;
    this.command = command;
  }
}
