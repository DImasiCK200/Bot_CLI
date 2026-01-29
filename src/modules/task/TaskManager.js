export class TaskManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.active = new Map();
    this.history = [];
    this.nextId = 1;
  }

  create(task) {
    task.id = this.nextId++;
    this.active.set(task.id, task);

    this.run(task);
    return task;
  }

  async run(task) {
    try {
      await task.run(this.ctx);
    } catch (err) {
      task.status = "failed";
      task.error = err;
    } finally {
      this.active.delete(task.id);
      this.history.unshift(task);
    }
  }

  cancel(id) {
    const task = this.active.get(id);
    if (id) task.cancel();
  }

  retry(task) {
    task.status = "pending";
    task.progress = 0;
    this.create(task);
  }
}
