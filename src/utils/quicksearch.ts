// src/utils/quicksearch.ts

// ===================== IMPORT SYNONYMS =====================
import goatSyn from "../../app/data/keywords/goat.json";
import pigSyn from "../../app/data/keywords/pig.json";
import cattleSyn from "../../app/data/keywords/cattle.json";
import chickenSyn from "../../app/data/keywords/chicken.json";

type SynInput = Record<string, string[]>;

export const normalizeText = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildReverseSynMap = (input: SynInput) => {
  const out: Record<string, string> = {};
  for (const canonical in input) {
    const variants = input[canonical] || [];

    const cNorm = normalizeText(canonical);
    if (cNorm) out[cNorm] = cNorm;

    for (const v of variants) {
      const vNorm = normalizeText(v);
      if (!vNorm) continue;
      out[vNorm] = cNorm; // biến thể → chuẩn
    }
  }
  return out;
};

// ===================== IMPORT CORE CONFIG =====================
import corePhraseWeight from "../../app/data/keywords/core_phrase_weight.json";
import groupBoostConfig from "../../app/data/keywords/group_boost_config.json";
import groupPhraseMap from "../../app/data/keywords/group_phrase_map.json";

// ===================== TYPES =====================
export type AnimalType = "goat" | "pig" | "cattle" | "chicken";

export type DiseaseListItem = {
  id: string;
  name: string;
  group: string;
  groupLabel?: string;
  searchText: string;
  severityLevel?: number;
  animal?: AnimalType;
};

export type QuicksearchResult = DiseaseListItem & {
  _score2: number;
  _score2Norm: number;
  _scoreGroupBoost: number;
  _score4: number;
  _finalScore: number;
  _matchedPhrases: string[];
  _negatedHits: string[];
  _topGroups: string[];
};

// ===================== SIGNAL WORDS =====================
const MILD_WORDS = [
  "nhe", "hoi", "it", "thinh thoang", "loang thoang", "chut", "khong nhieu", "moi"
];

const NEGATE_WORDS = ["khong", "chua", "chang", "ko", "k"];
// Các triệu chứng chuẩn được phép bị phủ định mạnh
const NEGATABLE_SYMPTOMS = [
  "tieu chay",
  "ho",
  "kho tho",
  "vang da",
  "co ve",
];

// Token phủ định sau khi đã normalize/synonyms
const NEGATION_TOKENS = ["khong", "ko", "chua", "chang", "k"];


// ===================== COMMON PHRASES CAP =====================
const COMMON_PHRASES = new Set([
  "sot", "sot cao", "ret run",
  "bo an", "giam an", "tum goc", "nam nhieu", "lu do", "met", "yeu",
  "ho", "ho khan", "ho nhieu",
  "tho nhanh", "kho tho", "kho khe",
  "tieu chay", "tieu chay nuoc", "phan long", "phan hoi", "phan vang", "phan trang"
]);

const COMMON_CAP_MAP: Record<string, number> = {
  respiratory: 1.2,
  digestive: 1.8,
  blood_parasite: 1.0,
  parasite: 1.5,
  parasite_external: 1.5,
  reproductive: 1.2,
  nervous: 1.2,
  other: 1.0,
};

const getCommonCap = (group: string) =>
  COMMON_CAP_MAP[group] ?? 1.5;


// ===================== BUILD REVERSE SYN MAPS =====================
const SYN_BY_ANIMAL: Record<AnimalType, Record<string, string>> = {
  goat: buildReverseSynMap(goatSyn as any),
  pig: buildReverseSynMap(pigSyn as any),
  cattle: buildReverseSynMap(cattleSyn as any),
  chicken: buildReverseSynMap(chickenSyn as any),
};

// ===================== L1: SIGNALS =====================
function detectSignals(normQuery: string) {
  const mild = MILD_WORDS.some(w => normQuery.includes(w));
  const hasNegation = NEGATE_WORDS.some(w => normQuery.includes(w));
  return { mild, hasNegation };
}

function extractNegationPhrases(normQuery: string) {
  const tokens = normQuery.split(" ");
  const negPhrases: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (NEGATE_WORDS.includes(tokens[i])) {
      const p1 = tokens[i + 1];
      const p2 = tokens[i + 2];
      if (p1) negPhrases.push(p1);
      if (p1 && p2) negPhrases.push(`${p1} ${p2}`);
    }
  }
  return Array.from(new Set(negPhrases));
}

// escape regex
const escapeReg = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsPhrase = (text: string, phrase: string) => {
  if (!phrase) return false;
  const padded = ` ${text} `;
  const needle = ` ${phrase} `;
  return padded.includes(needle);
};

// ===================== L1: APPLY SYNONYMS =====================
function applySynonyms(normQuery: string, synMap: Record<string, string>) {
  const keys = Object.keys(synMap).sort((a, b) => b.length - a.length);
  let out = normQuery;
  for (const k of keys) {
    const v = synMap[k];
    const re = new RegExp(`(^|\\s)${escapeReg(k)}(?=\\s|$)`, "g");
    out = out.replace(re, `$1${v}`);
  }
  return out;
}

// ===================== L1: BUILD PHRASES 1-4 WORDS =====================
function buildPhrases(normQuery: string, maxLen = 4) {
  const tokens = normQuery.split(" ").filter(Boolean);
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    let p = "";
    for (let l = 1; l <= maxLen && i + l <= tokens.length; l++) {
      p = l === 1 ? tokens[i] : p + " " + tokens[i + l - 1];
      phrases.push(p);
    }
  }
  return Array.from(new Set(phrases));
}

// ===================== L2: BUILD VOCAB + DF =====================
function getCanonicalVocab(animal: AnimalType) {
  const vocab = new Set<string>();

  // core weights
  for (const k of Object.keys(corePhraseWeight)) {
    const kn = normalizeText(k);
    if (kn) vocab.add(kn);
  }

  // canonical synonyms
  const synMap = SYN_BY_ANIMAL[animal] || {};
  for (const canonical of Object.values(synMap)) {
    const cn = normalizeText(canonical);
    if (cn) vocab.add(cn);
  }

  return vocab;
}

function buildPhraseDocFreq(diseases: DiseaseListItem[], vocab: Set<string>) {
  const df: Record<string, number> = {};
  for (const d of diseases) {
    const st = normalizeText(d.searchText || "");
    if (!st) continue;
    for (const p of vocab) {
      if (st.includes(p)) df[p] = (df[p] || 0) + 1;
    }
  }
  return df;
}

function rarityScore(phrase: string, df: Record<string, number>, N: number) {
  const freq = df[phrase] || 0;
  if (freq <= 0) return 1.0;
  const idf = Math.log(1 + N / (1 + freq));
  return Math.min(2.2, 0.8 + idf);
}

function lengthScore(phrase: string) {
  const n = phrase.split(" ").length;
  if (n === 1) return 1.0;
  if (n === 2) return 1.5;
  if (n === 3) return 2.0;
  return 2.4;
}

// ===================== L3 GROUP DETECTION =====================
type GroupPhraseMap = Record<string, Record<string, number>>;

/**
 * map chỉ điều hướng (BƯỚC 1 giữ nguyên)
 */
function detectTopGroups(phrases: string[], groupMap: GroupPhraseMap) {
  const votes: Record<string, number> = {};
  for (const g of Object.keys(groupMap)) votes[g] = 0;

  for (const p of phrases) {
    for (const g of Object.keys(groupMap)) {
      if (groupMap[g][p] !== undefined) votes[g] += 1;
    }
  }

  return Object.entries(votes)
    .sort((a, b) => b[1] - a[1])
    .map(([g]) => g)
    .slice(0, 2);
}

function groupBoostForDisease(group: string, topGroups: string[]) {
  const top1 = topGroups[0];
  const top2 = topGroups[1];

  if (group === top1) return (groupBoostConfig as any).top1_boost ?? 1.0;
  if (group === top2) return (groupBoostConfig as any).top2_boost ?? 0.5;
  return (groupBoostConfig as any).others_boost ?? 0.0;
}

// ===================== L4 SEVERITY =====================
function severityRank(level?: number) {
  const l = Math.max(0, Math.min(3, level ?? 0));
  return 1 + l * 0.5;
}

// ===================== ✅ CLUSTER CAP (broad evidence) =====================
// chỉ cap cho COMMON_PHRASES để tránh spam điểm kiểu PPR
const CLUSTER_COMMON: Record<string, string[]> = {
  breathing_distress: [
    "tho nhanh", "tho bung", "tho giat bung", "tho giat giat",
    "tho co keo", "tho ha mieng", "tho kho", "kho khe"
  ],
  diarrhea: [
    "tieu chay", "tieu chay nuoc", "phan long", "phan hoi", "phan trang", "phan vang"
  ],
};

const phraseToCommonCluster: Record<string, string> = {};
for (const cid of Object.keys(CLUSTER_COMMON)) {
  for (const p of CLUSTER_COMMON[cid]) phraseToCommonCluster[p] = cid;
}

// ===================== ✅ QUERY INTENT FLAGS =====================
const BLOOD_STRONG = new Set([
  "vang mat", "tai tim", "niem nhot", "niem tai", "thieu mau", "xanh xao"
]);

const PPR_ANCHORS = new Set([
  "loet mieng", "mieng hoi", "chay dai", "chay dai keo soi"
]);

// ===================== MAIN QUICKSEARCH =====================
export function quicksearch(
  rawQuery: string,
  diseases: DiseaseListItem[],
  animal: AnimalType,
  opts?: {
    alphaNormalize?: number;
    tieThreshold?: number;
    severityKHigh?: number;
    severityKLow?: number;
    groupK?: number;
    negationPenalty?: number;
  }
): QuicksearchResult[] {
  if (!rawQuery?.trim()) return [];

  const alphaNormalize = opts?.alphaNormalize ?? 0.7;
  const tieThreshold = opts?.tieThreshold ?? 0.8;
  const severityKHigh = opts?.severityKHigh ?? 0.10;
  const severityKLow  = opts?.severityKLow  ?? 0.05;
  const groupK = opts?.groupK ?? 0.30; // ✅ giảm nhẹ groupK để map chỉ là phụ
  const negationPenalty = opts?.negationPenalty ?? 1.2;

  // Subset theo loài
  const subset = diseases.filter(d => d.animal === animal);
  if (!subset.length) return [];

  // L1 normalize
  const norm0 = normalizeText(rawQuery);
  const { mild, hasNegation } = detectSignals(norm0);
  const negPhrases = hasNegation ? extractNegationPhrases(norm0) : [];

  // synonyms
  const synMap = SYN_BY_ANIMAL[animal] || {};
  const norm1 = applySynonyms(norm0, synMap);

  const phrasesAfterSyn = buildPhrases(norm1);
  const phrasesOriginal = buildPhrases(norm0);
  const originalSet = new Set(phrasesOriginal);
  const afterSynSet = new Set(phrasesAfterSyn);
    // ===== NEW: phát hiện phủ định trên canonical tokens sau khi đã dịch synonyms =====
  const tokensSyn = norm1.split(" ").filter(Boolean);
  const negatedCanonicalSymptoms: string[] = [];

  for (let i = 0; i < tokensSyn.length; i++) {
    const t = tokensSyn[i];
    if (!NEGATION_TOKENS.includes(t)) continue;

    const w1 = tokensSyn[i + 1];
    const w2 = tokensSyn[i + 2];

    if (w1) {
      const one = w1;
      const two = w2 ? `${w1} ${w2}` : null;

      // Ưu tiên bắt cụm 2 từ (ví dụ "tieu chay")
      if (two && NEGATABLE_SYMPTOMS.includes(two) && !negatedCanonicalSymptoms.includes(two)) {
        negatedCanonicalSymptoms.push(two);
      } else if (NEGATABLE_SYMPTOMS.includes(one) && !negatedCanonicalSymptoms.includes(one)) {
        negatedCanonicalSymptoms.push(one);
      }
    }
  }

// ===================== WEAK RESPIRATORY DETECTION =====================
const weakResp =
  afterSynSet.has("tho nhanh") &&
  !afterSynSet.has("tho bung") &&
  !afterSynSet.has("tho giat bung") &&
  !afterSynSet.has("tho giat giat");

  // ✅ intent flags
  const bloodIntent = phrasesAfterSyn.some(p => BLOOD_STRONG.has(p));
  const hasPprAnchor = phrasesAfterSyn.some(p => PPR_ANCHORS.has(p));

  // L2 DF clean
  const vocab = getCanonicalVocab(animal);
  const df = buildPhraseDocFreq(subset, vocab);
  const N = Math.max(1, subset.length);

  // L3 detect groups
  const topGroups = detectTopGroups(phrasesAfterSyn, groupPhraseMap as any);

  // L2 scoring
  const scored: QuicksearchResult[] = subset.map(d => {
    const st = normalizeText(d.searchText || "");
    let commonPart = 0;
    let specPart = 0;
    const matched: string[] = [];
    const negHits: string[] = [];

    let commonAdded = 0; // tổng điểm common đã ăn

    // ✅ cluster best for common phrases
    const bestCommonByCluster: Record<string, number> = {};

    for (const p of phrasesAfterSyn) {
      if (!p) continue;
      if (!st.includes(p)) continue;

      matched.push(p);

      const lenS = lengthScore(p);
      const coreW = (corePhraseWeight as any)[p] ?? 0;
      const rareS = rarityScore(p, df, N);
      const exactBonus = originalSet.has(p) ? 0.5 : 0;

      let add = (lenS + coreW) * rareS + exactBonus;

      const cap = getCommonCap(d.group);

      if (COMMON_PHRASES.has(p)) {
        // ✅ nếu là common và thuộc cụm rộng -> giữ max trong cụm
        const cid = phraseToCommonCluster[p];
        if (cid) {
          bestCommonByCluster[cid] = Math.max(bestCommonByCluster[cid] || 0, add);
          continue;
        }

        // common bình thường -> cap như cũ
        const remain = cap - commonAdded;
        if (remain <= 0) continue;
        if (add > remain) add = remain;
        commonAdded += add;
        commonPart += add;
      } else {
        // ✅ BUG FIX: non-common phải cộng vào specPart
        specPart += add;
      }
    }

    // ✅ apply cluster max for common
    for (const cid of Object.keys(bestCommonByCluster)) {
      let add = bestCommonByCluster[cid];
      const cap = getCommonCap(d.group);
      const remain = cap - commonAdded;
      if (remain <= 0) continue;
      if (add > remain) add = remain;
      commonAdded += add;
      commonPart += add;
    }

    // cap common
    commonPart = Math.min(commonPart, getCommonCap(d.group));

    // negation
    if (negPhrases.length) {
      for (const np of negPhrases) {
        if (np && st.includes(np)) {
          negHits.push(np);
          specPart -= negationPenalty;
        }
      }
    }
        // ===== NEW: phủ định triệu chứng chuẩn, kiểu "khong tieu chay" =====
    if (negatedCanonicalSymptoms.length) {
      let hitStrong = false;

      for (const sym of negatedCanonicalSymptoms) {
        if (containsPhrase(st, sym)) {
          hitStrong = true;
          // đánh dấu để debug nếu cần
          negHits.push(`!${sym}`);
        }
      }

      // Nếu bệnh có bất kỳ triệu chứng thuộc nhóm bị phủ định -> đạp điểm rất mạnh
      if (hitStrong) {
        commonPart = 0;
        specPart = specPart - 20; // đủ lớn để _score2Norm âm -> bệnh bị loại khỏi shortlist
      }
    }


    let score2 = commonPart + specPart;
    let score2Norm =
      score2 / Math.pow(Math.max(1, phrasesAfterSyn.length), alphaNormalize);

    const gb = groupBoostForDisease(d.group, topGroups) * groupK;

    return {
      ...d,
      _score2: score2,
      _score2Norm: score2Norm,
      _scoreGroupBoost: gb,
      _score4: 0,
      _finalScore: 0,
      _matchedPhrases: matched,
      _negatedHits: negHits,
      _topGroups: topGroups
    };
  });

  const shortlist = scored.filter(r => r._score2Norm > 0);
  if (!shortlist.length) return [];

  const topScore2 = Math.max(...shortlist.map(r => r._score2Norm));

  // L4 severity + final compose
for (const r of shortlist) {
  const diff = topScore2 - r._score2Norm;
  const sevRank = severityRank(r.severityLevel);

  let k = diff < tieThreshold ? severityKHigh : severityKLow;
  if (mild) k *= 0.5;

  // giảm sức mạnh severity nếu bệnh không thuộc topGroups
  if (!topGroups.includes(r.group)) k *= 0.3;

  // giảm severity nếu match quá ít
  const matchRatio =
    r._matchedPhrases.length / Math.max(1, phrasesAfterSyn.length);
  if (matchRatio < 0.25) k *= 0.5;

  r._score4 = sevRank * k;
  r._finalScore = r._score2Norm + r._scoreGroupBoost + r._score4;

  // blood intent boost
  if (bloodIntent) {
    if (r.group === "blood_parasite") r._finalScore += 0.70;
    else r._finalScore *= 0.80;
  }

  // PPR anti-spam
  if (r.id === "ppr" || r.id === "ppr-goat") {
    if (!hasPprAnchor) r._finalScore *= 0.30;
  }

  // weak respiratory penalty
  if (weakResp && r.group === "respiratory") {
    r._finalScore *= 0.65;
  }

  // blood intent thì hạ digestive thêm
  if (bloodIntent && r.group === "digestive") {
    r._finalScore *= 0.75;
  }
}

  shortlist.sort((a, b) => {
    if (b._finalScore !== a._finalScore) return b._finalScore - a._finalScore;
    const sa = a.severityLevel ?? 0;
    const sb = b.severityLevel ?? 0;
    if (sb !== sa) return sb - sa;
    return a.name.localeCompare(b.name, "vi");
  });

  return shortlist;
}
