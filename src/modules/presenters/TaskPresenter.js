export class TaskPresenter {
  static toLines(task) {
    const lines = [];

    lines.push(`ID: ${task.id}`);
    lines.push(`Type: ${task.type}`);
    lines.push(`Title: ${task.title}`);
    lines.push(`Status: ${task.status}`);

    if (typeof task.progress === "number") {
      lines.push(`Progress: ${task.progress}%`);
    }

    if (task.startedAt) {
      lines.push(`Started: ${task.startedAt.toLocaleString()}`);
    }

    if (task.finishedAt) {
      lines.push(`Finished: ${task.finishedAt.toLocaleString()}`);
    }

    if (task.itemName) {
      lines.push(`Item: ${task.itemName}`);
    }

    if (task.price) {
      lines.push(`Price: ${task.price}`);
    }

    if (task.quantity) {
      lines.push(`Quantity: ${task.quantity}`);
    }

    if (task.error) {
      lines.push(`Error: ${task.error.message ?? task.error}`);
    }

    return lines;
  }
}
