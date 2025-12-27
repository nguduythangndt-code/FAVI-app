// src/services/data/types.ts
export type DataBundle = {
  schemaVersion: number;
  dataVersion: string;
  minAppVersion?: string;
  payload: any;
};
