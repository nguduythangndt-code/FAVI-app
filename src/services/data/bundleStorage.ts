// src/services/data/bundleStorage.ts
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DIR = `${FileSystem.documentDirectory}favi/`;
const BUNDLE_PATH = `${DIR}last_good_bundle.json`;
const META_KEY = "favi:last_good_meta";

export async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
}

export async function saveLastGoodBundle(bundleJson: string, meta: any) {
  await ensureDir();
  await FileSystem.writeAsStringAsync(BUNDLE_PATH, bundleJson, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
}

export async function loadLastGoodBundleJson(): Promise<string | null> {
  try {
    const info = await FileSystem.getInfoAsync(BUNDLE_PATH);
    if (!info.exists) return null;
    return await FileSystem.readAsStringAsync(BUNDLE_PATH, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch {
    return null;
  }
}

export async function loadLastGoodMeta(): Promise<any | null> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function clearLastGood() {
  try {
    await FileSystem.deleteAsync(BUNDLE_PATH, { idempotent: true });
  } catch {}
  try {
    await AsyncStorage.removeItem(META_KEY);
  } catch {}
}
