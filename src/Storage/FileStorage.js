import { Storage } from "./Storage.js";

import path from "path";
import fs from "fs/promises";

export class FileStorage extends Storage {
  constructor(baseDir = "./data") {
    super();
    this.baseDir = baseDir;
  }

  load(key) {}

  save(key, value) {}

  remove(key) {}

  close() {
    console.log("Storage closed");
  }
}
