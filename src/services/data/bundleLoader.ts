// src/services/data/bundleLoader.ts
import { validateBundle } from "./bundleValidator";
import { loadLastGoodBundleJson, saveLastGoodBundle } from "./bundleStorage";
import type { DataBundle } from "./types";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/config/firebaseConfig";

function loadBundledBaseline(): DataBundle {
  return {
    schemaVersion: 1,
    dataVersion: "baseline",
    payload: require("../../../app/data/baseline.json"),
  };
}

async function fetchRemoteBundleJson(): Promise<string | null> {
  try {
    const ref = doc(db, "app_config", "data_bundle");
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return JSON.stringify(snap.data());
  } catch (e) {
    console.warn("[REMOTE] Failed to fetch Firestore bundle", e);
    return null;
  }
}

function assertBaselineValid(baseline: any) {
  // baseline sai = lỗi dev, phải nổ ngay để sửa
  const ok = validateBundle(baseline);
  if (!ok) {
    if (__DEV__) {
      throw new Error("[BASELINE] baseline bundle failed validation");
    }
    // production: vẫn trả baseline (nhưng baseline mà sai thì coi như app lỗi build)
  }
}

export async function getActiveBundle(): Promise<{
  bundle: DataBundle;
  source: "remote" | "cache" | "baseline";
}> {
  const baseline = loadBundledBaseline();
  assertBaselineValid(baseline);

  // A) thử remote
  try {
    const remoteJson = await fetchRemoteBundleJson();
    if (remoteJson) {
      const parsed = JSON.parse(remoteJson);

      if (validateBundle(parsed)) {
        await saveLastGoodBundle(remoteJson, {
          schemaVersion: parsed.schemaVersion,
          dataVersion: parsed.dataVersion,
          savedAt: Date.now(),
        });
        return { bundle: parsed, source: "remote" };
      } else {
        console.warn("[REMOTE] bundle validation failed");
      }
    }
  } catch (e) {
    console.warn("[REMOTE] parse/validate error", e);
  }

  // B) thử cache last-good
  try {
    const cachedJson = await loadLastGoodBundleJson();
    if (cachedJson) {
      const parsed = JSON.parse(cachedJson);
      if (validateBundle(parsed)) {
        return { bundle: parsed, source: "cache" };
      } else {
        console.warn("[CACHE] bundle validation failed");
      }
    }
  } catch (e) {
    console.warn("[CACHE] parse/validate error", e);
  }

  // C) baseline (đã validate ở trên)
  return { bundle: baseline, source: "baseline" };
}
