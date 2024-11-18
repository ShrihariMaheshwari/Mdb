import { BaseRecord } from "./index";

export type QueryOperator =
  | "$eq"
  | "$ne"
  | "$gt"
  | "$gte"
  | "$lt"
  | "$lte"
  | "$in"
  | "$nin"
  | "$regex";

export type QueryCondition = {
  [K in QueryOperator]?: any;
};

export type QueryFilter<T extends BaseRecord> = {
  [K in keyof T]?: QueryCondition | T[K];
};

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}
