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

  private isValidCollectionName(name: string): boolean {
    return Boolean(
      name &&
      typeof name === 'string' &&
      name !== 'collections' &&
      /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)
    );
  }

  async exists(collection: string): Promise<boolean> {
    if (!this.isValidCollectionName(collection)) {
      return false;
    }
    const filePath = this.getCollectionPath(collection);
    return fs.pathExists(filePath);
  }

  async read<T extends BaseRecord>(collection: string): Promise<Map<Id, T>> {
    if (!this.isValidCollectionName(collection)) {
      throw new DatabaseError(
        `Invalid collection name: ${collection}`,
        "INVALID_COLLECTION"
      );
    }

    try {
      const filePath = this.getCollectionPath(collection);

      if (!(await fs.pathExists(filePath))) {
        return new Map();
      }

      const data = await fs.readFile(filePath, "utf-8");
      const rawRecords = JSON.parse(data);
      
      // Create entries array with correct typing
      const entries: Array<[Id, T]> = Object.entries(rawRecords).map(
        ([id, record]: [string, any]) => [
          id,
          {
            ...record,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt)
          } as T
        ]
      );

      return new Map(entries);
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
    if (!this.isValidCollectionName(collection)) {
      throw new DatabaseError(
        `Invalid collection name: ${collection}`,
        "INVALID_COLLECTION"
      );
    }

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
    if (!this.isValidCollectionName(collection)) {
      throw new DatabaseError(
        `Invalid collection name: ${collection}`,
        "INVALID_COLLECTION"
      );
    }

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

  async listCollections(): Promise<string[]> {
    const files = await fs.readdir(this.dataDir);
    return files
      .filter(file => 
        file.endsWith(".json") && 
        this.isValidCollectionName(file.replace(".json", ""))
      )
      .map(file => file.replace(".json", ""));
  }

  async cleanup(): Promise<void> {
    const files = await fs.readdir(this.dataDir);
    
    for (const file of files) {
      const collectionName = file.replace(".json", "");
      if (!this.isValidCollectionName(collectionName)) {
        const filePath = this.getCollectionPath(collectionName);
        await fs.remove(filePath);
      }
    }
  }
}