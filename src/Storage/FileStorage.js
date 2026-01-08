import { Storage } from "./Storage.js";

import path from "path";
import fs from "fs/promises";

export class FileStorage extends Storage {
  constructor(baseDir = "./data", accountFile = "accounts.json") {
    super();
    this.baseDir = baseDir;
    this.accountFile = accountFile;
  }

  async ensureDir() {
    return fs.mkdir(this.baseDir, { recursive: true });
  }

  // Base storage methods
  async readJson(file, fallback = []) {
    try {
      const fullPath = path.join(this.baseDir, file);      
      const data = await fs.readFile(fullPath, "utf-8");
      const json = JSON.parse(data)
      return json;
    } catch (err) {
      if (err.code === "ENOENT") {
        return fallback;
      }
      throw err
    }
  }

  async writeJson(file, data) {
    const fullPath = path.join(this.baseDir, file);
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(fullPath, json, "utf-8");
  }

  // Methods for AccountManager
  async loadAccounts() {
    return await this.readJson(this.accountFile);
  }

  async saveAccounts(accounts) {
    await this.writeJson(this.accountFile, accounts);
  }
  // Close storage
  close() {
    console.log("Storage closed");
  }
}
