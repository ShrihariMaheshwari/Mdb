import fs from "fs-extra";
import path from "path";
import { StorageEngine } from "../types/storage";
import { BaseRecord, Id } from "../types";
import { DatabaseError } from "../types/errors";

export class FileStorageEngine implements StorageEngine {
  constructor(private dataDir: string) {
    this.initialize();
  }

  private initialize(): void {
    fs.ensureDirSync(this.dataDir);
  }

  private getCollectionPath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  async exists(collection: string): Promise<boolean> {
    const filePath = this.getCollectionPath(collection);
    return fs.pathExists(filePath);
  }

  async read<T extends BaseRecord>(collection: string): Promise<Map<Id, T>> {
    try {
      const filePath = this.getCollectionPath(collection);

      if (!(await fs.pathExists(filePath))) {
        return new Map();
      }

      const data = await fs.readFile(filePath, "utf-8");
      const records = JSON.parse(data, (key, value) => {
        if (key === "createdAt" || key === "updatedAt") {
          return new Date(value);
        }
        return value;
      });

      return new Map(Object.entries(records));
    } catch (error) {
      throw new DatabaseError(
        `Failed to read collection ${collection}`,
        "READ_ERROR",
        error as Error
      );
    }
  }

  async write<T extends BaseRecord>(
    collection: string,
    data: Map<Id, T>
  ): Promise<void> {
    try {
      const filePath = this.getCollectionPath(collection);
      const records = Object.fromEntries(data);
      await fs.writeFile(filePath, JSON.stringify(records, null, 2));
    } catch (error) {
      throw new DatabaseError(
        `Failed to write collection ${collection}`,
        "WRITE_ERROR",
        error as Error
      );
    }
  }

  async delete(collection: string): Promise<void> {
    try {
      const filePath = this.getCollectionPath(collection);
      await fs.remove(filePath);
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete collection ${collection}`,
        "DELETE_ERROR",
        error as Error
      );
    }
  }
}
