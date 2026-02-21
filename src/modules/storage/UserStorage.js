import { Storage } from "./Storage.js";
import path from "path";
import fs from "fs/promises";

export class UserStorage extends Storage {
  constructor({
    baseDir,
    userId,
    accountFile = "accounts.json",
    stateFile = "state.json",
  }) {
    super();

    this.userDir = path.join(baseDir, "users", String(userId));

    this.accountFile = accountFile;
    this.stateFile = stateFile;
  }

  async ensureDir() {
    await fs.mkdir(this.userDir, { recursive: true });
    await fs.mkdir(path.join(this.userDir, "sessions"), { recursive: true });
  }

  _path(relPath) {
    return path.join(this.userDir, relPath);
  }

  async readJson(relPath, fallback = []) {
    try {
      const data = await fs.readFile(this._path(relPath), "utf-8");
      return JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") {
        return fallback;
      }

      throw err;
    }
  }

  async writeJson(relPath, data) {
    const fullPath = this._path(relPath);

    await fs.mkdir(path.dirname(fullPath), {
      recursive: true,
    });

    await fs.writeFile(
      this._path(relPath),
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  }

  // Accounts
  async loadAccounts() {
    return this.readJson(this.accountFile);
  }

  async saveAccounts(accounts) {
    const toSave = accounts.map(({ steamApi, ...rest }) => rest);
    return this.writeJson(this.accountFile, toSave);
  }

  async loadAppState() {
    return this.readJson(this.stateFile, {});
  }

  async saveAppState(state) {
    return this.writeJson(this.accountFile, state);
  }

  async loadAccountSession(accountName) {
    return this.readJson(
      path.join("sessions", `session_${accountName}.json`),
      null,
    );
  }

  async saveAccountSession(accountName, state) {
    const toSave = {
      ...state,
      createdAt: Date.now(),
    };
    return this.writeJson(
      path.join("sessions", `session_${accountName}.json`),
      toSave,
    );
  }

  close() {}
}
