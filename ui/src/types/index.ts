export interface Collection {
  name: string;
  count: number;
}

export interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface QueryFilter {
  [key: string]:
    | {
        $eq?: any;
        $ne?: any;
        $gt?: number;
        $gte?: number;
        $lt?: number;
        $lte?: number;
        $in?: any[];
        $nin?: any[];
        $regex?: string;
      }
    | any;
}
