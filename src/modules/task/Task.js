import EventEmitter from "events";

export class Task extends EventEmitter {
  constructor({ id, type, title }) {
    super();
    this.id = id;
    this.type = type;
    this.title = title;

    this.status = "pending"; // pending | running | done | error | cancelled
    this.progress = 0;
    this.error = null;
    this.startedAt = null;
    this.finishedAt = null;
  }

  start() {
    this.status = "running";
    this.startedAt = new Date();
    this.emit("update");
  }

  setProgress(value) {
    this.progress = value;
    this.emit("update");
  }

  complete() {
    this.status = "done";
    this.progress = 100;
    this.finishedAt = new Date();
    this.emit("update");
  }

  fail(err) {
    this.status = "error";
    this.error = err;
    this.finishedAt = new Date();
    this.emit("update");
  }

  cancel() {
    this.status = "cancelled";
    this.finishedAt = new Date();
    this.emit("update");
  }
}
