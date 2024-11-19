export type Id = string;

export interface BaseRecord {
  id: Id;
  createdAt: Date;
  updatedAt: Date;
}

export type WithoutBaseRecord<T> = Omit<T, keyof BaseRecord>; // this is required as database manages them user dont have to provide it

export * from "./database";
export * from "./query";
export * from "./storage";
export * from "./errors";
