// src/services/data/bundleValidator.ts
import type { DataBundle } from "./types";

export function validateBundle(b: any): b is DataBundle {
  if (!b || typeof b !== "object") return false;
  if (typeof b.schemaVersion !== "number") return false;
  if (typeof b.dataVersion !== "string") return false;
  if (!("payload" in b)) return false;
  return true;
}
