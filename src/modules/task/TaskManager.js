export class TaskManager {
  constructor() {
    this.tasks = [];
  }

  get list() {
    return this.tasks;
  }

  get running() {
    return this.tasks.filter((t) => t.status === "running");
  }

  getHistory(limit = 10) {
    return this.tasks.filter((t) => t.status !== "running").slice(-limit);
  }

  add(task, ctx) {
    this.tasks.push(task);
    task.start(ctx);
    return task;
  }

  cancel(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) task.cancel();
  }
}
