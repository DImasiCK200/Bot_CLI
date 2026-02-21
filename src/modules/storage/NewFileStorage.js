import path from "path";
import fs from "fs/promises";
import { UserStorage } from "./UserStorage.js";

export class NewFileStorage {
  constructor({ baseDir = "./data" }) {
    this.baseDir = baseDir;
  }

  // async ensureBaseDir() {
  //   await fs.mkdir(path.join(this.baseDir, "users"), { recursive: true });
  // }

  forUser(userId) {
    if (!userId) {
      throw new Error("UserId is required!");
    }

    return new UserStorage({
      baseDir: this.baseDir,
      userId,
    });
  }
}
