export class Task {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;

    this.status = "pending"; // pending | running | done | failed | cancelled
    this.progress = 0;
    this.error = null;

    this.createdAt = Date.now();
    this.finishedAt = null;
  }

  async start(ctx) {
    this.status = "running";
  }

  async cancel() {
    this.status = "cancelled";
    this.finishedAt = Date.now();
  }

  setProgress(value) {
    this.progress = value;
  }

  finish() {
    this.status = "done";
    this.setProgress(100);
    this.finishedAt = Date.now();
  }

  fail(err) {
    this.status = "error";
    this.error = err;
    this.finishedAt = Date.now();
  }
}
