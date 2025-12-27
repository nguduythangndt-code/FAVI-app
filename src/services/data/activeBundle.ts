// src/services/data/activeBundle.ts
import type { DataBundle } from "./types";

let _activeBundle: DataBundle | null = null;
let _bundleSource: "remote" | "cache" | "baseline" | null = null;

export function setActiveBundle(
  bundle: DataBundle,
  source: "remote" | "cache" | "baseline"
) {
  _activeBundle = bundle;
  _bundleSource = source;
}

export function getActiveBundle(): DataBundle {
  if (!_activeBundle) {
    throw new Error("Active bundle is not initialized");
  }
  return _activeBundle;
}

export function getActiveBundleInfo() {
  return {
    source: _bundleSource,
    dataVersion: _activeBundle?.dataVersion,
    schemaVersion: _activeBundle?.schemaVersion,
  };
}
