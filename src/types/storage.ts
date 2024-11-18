import { BaseRecord, Id } from "./index";

export interface StorageEngine {
  read<T extends BaseRecord>(collection: string): Promise<Map<Id, T>>;
  write<T extends BaseRecord>(
    collection: string,
    data: Map<Id, T>
  ): Promise<void>;
  delete(collection: string): Promise<void>;
  exists(collection: string): Promise<boolean>;
}
