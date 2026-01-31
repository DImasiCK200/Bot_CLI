import EventEmitter from "events";

export class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }

  add(task) {
    this.tasks.push(task);

    task.on("update", () => {
      this.emit("update", task);
    });

    return task;
  }

  run(task) {
    this.add(task);
    task.run();
  }

  getAll() {
    return this.tasks;
  }

  getRunning() {
    return this.tasks.filter((t) => t.status === "running");
  }

  getHistory(limit = 10) {
    return this.tasks.filter((t) => t.status !== "running").slice(-limit);
  }
}
