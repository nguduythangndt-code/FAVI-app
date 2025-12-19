// src/storage/mmkv.ts
let _mmkv: any = null;

export function getMMKV() {
  if (_mmkv) return _mmkv;
  try {
    const { MMKV } = require("react-native-mmkv");
    _mmkv = new MMKV();
    return _mmkv;
  } catch {
    return null;
  }
}

export function mmkvGetString(key: string): string | null {
  const m = getMMKV();
  return m ? (m.getString(key) ?? null) : null;
}

export function mmkvSetString(key: string, value: string) {
  const m = getMMKV();
  if (m) m.set(key, value);
}
