// src/services/quicksearchRules.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getMMKV } from "../storage/mmkv";


export type AnimalId = "goat" | "pig" | "cattle" | "chicken";

export type QuicksearchRules = {
  version: number;
  learnedBoost: Record<string, Record<string, number>>; // queryKey -> { diseaseId: addScore }
  boost?: { hitAdd?: number; nonHitMul?: number };
  updatedAt?: any;
};

type CachedRules = {
  rules: QuicksearchRules;
  fetchedAt: number; // ms
};

const KEY = (animal: AnimalId) => `quicksearchRules:${animal}`;
const KEY_META = `quicksearchRules:lastSyncMeta`; // để xoay vòng (optional)

const DEFAULT_RULES: QuicksearchRules = {
  version: 0,
  learnedBoost: {},
  boost: { hitAdd: 3.0, nonHitMul: 0.8 },
  updatedAt: null,
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function safeParseJSON<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function isValidRules(x: any): x is QuicksearchRules {
  if (!x || typeof x !== "object") return false;
  if (typeof x.version !== "number") return false;
  if (!x.learnedBoost || typeof x.learnedBoost !== "object") return false;
  return true;
}

export function getCachedQuicksearchRules(animal: AnimalId): CachedRules | null {
  const mmkv = getMMKV();
  const raw = mmkv ? (mmkv.getString(KEY(animal)) ?? null) : null;
  return safeParseJSON<CachedRules>(raw);
}


export function setCachedQuicksearchRules(animal: AnimalId, cached: CachedRules) {
  const mmkv = getMMKV();
  if (!mmkv) return;
  mmkv.set(KEY(animal), JSON.stringify(cached));
}


export type SyncPolicy =
  | { kind: "ttl"; ttlDays: number } // TTL 5-7 ngày
  | { kind: "rotateDaily" }; // mỗi ngày sync 1 loài (siêu tiết kiệm)

function daysToMs(d: number) {
  return d * 24 * 60 * 60 * 1000;
}

function shouldSyncByTTL(animal: AnimalId, ttlDays: number) {
  const cached = getCachedQuicksearchRules(animal);
  if (!cached) return true;
  const age = Date.now() - cached.fetchedAt;
  return age > daysToMs(ttlDays);
}

// rotateDaily: mỗi ngày chỉ sync 1 loài (goat->pig->cattle->chicken)
const ROTATE_ORDER: AnimalId[] = ["goat", "pig", "cattle", "chicken"];

function shouldSyncByRotateDaily(animal: AnimalId) {
  const today = new Date();
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  const mmkv = getMMKV();

  const metaRaw = mmkv ? (mmkv.getString(KEY_META) ?? null) : null;
  const meta = safeParseJSON<{ date: string; idx: number }>(metaRaw) ?? {
    date: "",
    idx: 0,
  };

  // nếu sang ngày mới -> tăng idx
  let idx = meta.idx;
  if (meta.date !== ymd) idx = (idx + 1) % ROTATE_ORDER.length;

  // lưu lại meta (nếu mmkv có)
  if (mmkv) {
    mmkv.set(KEY_META, JSON.stringify({ date: ymd, idx }));
  }


  const targetAnimal = ROTATE_ORDER[idx];
  return animal === targetAnimal;
}

function shouldSync(animal: AnimalId, policy: SyncPolicy) {
  if (policy.kind === "ttl") return shouldSyncByTTL(animal, policy.ttlDays);
  return shouldSyncByRotateDaily(animal);
}

export async function loadQuicksearchRules(
  animal: AnimalId,
  policy: SyncPolicy = { kind: "ttl", ttlDays: 7 }
): Promise<QuicksearchRules> {
  // 1) luôn ưu tiên cache để app chạy offline mượt
  const cached = getCachedQuicksearchRules(animal);
  const cachedRules =
    cached?.rules && isValidRules(cached.rules) ? cached.rules : DEFAULT_RULES;

  // 2) check policy: không tới kỳ sync -> trả cache luôn
  const doSync = shouldSync(animal, policy);
  if (!doSync) return cachedRules;

  // 3) thử kéo cloud
  try {
    const ref = doc(db, "quicksearchRules", animal);
    const snap = await getDoc(ref);

    if (!snap.exists()) return cachedRules;

    const cloud = snap.data() as any;

    // validate tối thiểu
    if (!isValidRules(cloud)) return cachedRules;

    // version compare
    const cloudVersion = cloud.version ?? 0;
    const localVersion = cachedRules.version ?? 0;

    if (cloudVersion > localVersion) {
      const normalized: QuicksearchRules = {
        version: cloudVersion,
        learnedBoost: cloud.learnedBoost ?? {},
        boost: cloud.boost ?? cachedRules.boost ?? DEFAULT_RULES.boost,
        updatedAt: cloud.updatedAt ?? null,
      };

      setCachedQuicksearchRules(animal, {
        rules: normalized,
        fetchedAt: Date.now(),
      });

      return normalized;
    }

    // cloud không mới -> vẫn refresh fetchedAt để TTL khỏi sync lại liên tục
    if (cachedRules.version > 0) {
      setCachedQuicksearchRules(animal, {
        rules: cachedRules,
        fetchedAt: Date.now(),
      });
    }

    return cachedRules;
  } catch {
    // mạng lỗi / permission -> dùng cache
    return cachedRules;
  }
}

export type ShortlistItem = {
  id: string; // diseaseId
  _finalScore: number;
  [k: string]: any;
};

export function applyLearnedBoost(
  shortlist: ShortlistItem[],
  queryKey: string,
  rules: QuicksearchRules,
  opts?: { clampMax?: number }
): ShortlistItem[] {
  const clampMax = opts?.clampMax ?? 20;

  const mapping = rules.learnedBoost?.[queryKey];
  if (!mapping) return shortlist;

  // copy shallow để an toàn (khỏi mutate state cũ)
  const out = shortlist.map((it) => ({ ...it }));

  for (const item of out) {
    const add = mapping[item.id];
    if (typeof add === "number" && Number.isFinite(add)) {
      item._finalScore = item._finalScore + clamp(add, 0, clampMax);
    }
  }

  return out;
}
