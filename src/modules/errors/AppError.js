export class AppError extends Error {
  constructor(message) {
    super();
    this.isAppError = true;
    this.message = message
  }
}
