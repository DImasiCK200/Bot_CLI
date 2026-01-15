import { AppError } from "./AppError.js";

export class FatalError extends AppError {
  fatal = true;
}
