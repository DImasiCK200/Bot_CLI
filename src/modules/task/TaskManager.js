import EventEmitter from "events";

export class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.taskList = []
    this.tasks = [];
    this.currentTask = null;
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

  choose(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    this.currentTask = task;
  }

  pop() {
    return this.currentTask;
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
