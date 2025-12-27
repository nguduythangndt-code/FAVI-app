// src/services/data/bundleLoader.ts
import { validateBundle } from "./bundleValidator";
import { loadLastGoodBundleJson, saveLastGoodBundle } from "./bundleStorage";
import type { DataBundle } from "./types";

// ✅ Firestore remote
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/config/firebaseConfig";

// 1) Bundled baseline (luôn có)
function loadBundledBaseline(): DataBundle {
  return {
    schemaVersion: 1,
    dataVersion: "baseline",
    payload: require("../../../app/data/baseline.json"),
  };
}

// 2) Remote fetch (Firestore)
async function fetchRemoteBundleJson(): Promise<string | null> {
  try {
    // 🔧 đổi đúng path doc của mày
    // Gợi ý: collection "app_config", doc "data_bundle"
    const ref = doc(db, "app_config", "data_bundle");
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    return JSON.stringify(data);
  } catch (e) {
    console.warn("[REMOTE] Failed to fetch Firestore bundle", e);
    return null;
  }
}

export async function getActiveBundle(): Promise<{
  bundle: DataBundle;
  source: "remote" | "cache" | "baseline";
}> {
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
      }
    }
  } catch {
    // ignore → fallback
  }

  // B) thử cache last-good
  try {
    const cachedJson = await loadLastGoodBundleJson();
    if (cachedJson) {
      const parsed = JSON.parse(cachedJson);
      if (validateBundle(parsed)) {
        return { bundle: parsed, source: "cache" };
      }
    }
  } catch {
    // ignore → fallback
  }

  // C) baseline
  return { bundle: loadBundledBaseline(), source: "baseline" };
}
