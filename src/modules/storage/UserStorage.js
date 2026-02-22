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
      const fullPath = this._path(relPath);

      const data = await fs.readFile(fullPath, "utf-8");
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

    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
  }

  // Accounts
  async loadAccounts() {
    return await this.readJson(this.accountFile);
  }

  async saveAccounts(accounts) {
    const toSave = accounts.map(({ steamApi, ...rest }) => rest);
    return await this.writeJson(this.accountFile, toSave);
  }

  async loadAppState() {
    return await this.readJson(this.stateFile);
  }

  async saveAppState(state) {
    return await this.writeJson(this.stateFile, state);
  }

  async loadAccountSession(accountName) {
    return await this.readJson(
      path.join("sessions", `session_${accountName}.json`),
    );
  }

  async saveAccountSession(accountName, session) {
    const toSave = {
      ...session,
      createdAt: Date.now(),
    };
    return await this.writeJson(
      path.join("sessions", `session_${accountName}.json`),
      toSave,
    );
  }

  close() {}
}
