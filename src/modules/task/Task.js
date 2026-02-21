import EventEmitter from "events";

export class Task extends EventEmitter {
  constructor({ type, title }) {
    super();
    this.id = Date.now();
    this.type = type;
    this.title = title;

    this.status = "pending"; // pending | running | done | error | cancelled
    this.progress = 0;
    this.error = null;
    this.startedAt = null;
    this.finishedAt = null;

    this.controller = new AbortController();
  }

  get signal() {
    return this.controller.signal;
  }

  isCancelled() {
    return this.controller.signal.aborted;
  }

  start() {
    if (this.status !== "pending") return;

    this.status = "running";
    this.startedAt = new Date();
    this.emit("update");
  }

  setProgress(value) {
    this.progress = value;
    this.emit("update");
  }

  complete() {
    if (this.status !== "running") return;

    this.status = "done";
    this.progress = 100;
    this.finishedAt = new Date();
    this.emit("update");
  }

  fail(err) {
    if (this.status !== "running") return;

    this.status = "error";
    this.error = err;
    this.finishedAt = new Date();
    this.emit("update");
  }

  cancel() {
    if (this.status !== "running") return;

    this.controller.abort();
    this.status = "cancelled";
    this.finishedAt = new Date();
    this.emit("update");
  }

  async runWithCancel(promise) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        this.signal.addEventListener("abort", () =>
          reject(new Error("Cancelled")),
        );
      }),
    ]);
  }
}
