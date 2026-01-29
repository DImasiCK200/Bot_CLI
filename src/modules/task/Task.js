export class Task {
  constructor({ accountId = null, data = {} }) {
    this.id = null;
    this.accountId = accountId;
    this.status = "pending";
    this.progress = 0;
    this.error = null;
    this.data = data;

    this.listeners = {};
  }

  on(event, callback) {
    this.listeners[event] ??= [];
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    this.listeners[event]?.forEach((callback) => {
      callback(payload);
    });
  }

  setProgress(value) {
    this.progress = value;
    this.emit("progress", value);
  }

  async run(ctx) {
    throw new Error("run() not implemented");
  }

  cancel() {
    this.status = "cancelled";
    this.emit("cancelled");
  }
}
