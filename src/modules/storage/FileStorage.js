import { Storage } from "./Storage.js";

import path from "path";
import fs from "fs/promises";

export class FileStorage extends Storage {
  constructor({
    baseDir = "./data",
    subDirs = [],
    accountFile = "accounts.json",
    stateFile = "state.json",
  }) {
    super();
    this.baseDir = baseDir;
    this.subDirs = subDirs;
    this.accountFile = accountFile;
    this.stateFile = stateFile;
  }

  async ensureDir() {
    return Promise.all(
      this.subDirs.map((dir) =>
        fs.mkdir(path.join(this.baseDir, dir), { recursive: true })
      )
    );
  }

  // Base storage methods
  async readJson(file, fallback = []) {
    try {
      const fullPath = path.join(this.baseDir, file);
      const data = await fs.readFile(fullPath, "utf-8");
      const json = JSON.parse(data);
      return json;
    } catch (err) {
      if (err.code === "ENOENT") {
        return fallback;
      }
      throw err;
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

  // Methods for AppState
  async loadAppState() {
    return await this.readJson(this.stateFile);
  }

  async saveAppState(state) {
    await this.writeJson(this.stateFile, state);
  }

  // Methods for Account sessions
  async loadAccountSession(accountName) {
    return await this.readJson(path.join("session", `session_${accountName}.json`));
  }

  async saveAccountSession(accountName, session) {
    const toSave = {
      ...session,
      createdAt: Date.now(),
    };

    await this.writeJson(
      path.join("session", `session_${accountName}.json`, toSave),
      session
    );
  }

  // Close storage
  close() {
    console.log("Storage closed");
  }
}
