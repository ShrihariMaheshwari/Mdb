import { BaseRecord } from "./index";

export type ComparisonValue = string | number | boolean | Date;
export type ArrayValue = ComparisonValue[];

export interface QueryOperators {
  $eq?: ComparisonValue;
  $ne?: ComparisonValue;
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $in?: ArrayValue;
  $nin?: ArrayValue;
  $regex?: string;
}

export type QueryFilter<T extends BaseRecord> = {
  [K in keyof T]?: Partial<QueryOperators> | T[K];
};

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
