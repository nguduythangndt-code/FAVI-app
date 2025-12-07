// src/constants/drugLinks.ts
import {
  GENERATED_DRUG_LINK_MAP,
  DrugRoute,
} from "./generatedDrugLinks";

// nếu cần override vài case đặc biệt thì thêm ở đây
const MANUAL_OVERRIDES: Record<string, DrugRoute> = {
  // ví dụ:
  // "Tên khác nhưng muốn trỏ về Ceftiofur": { group: "antibiotic", id: "ceftiofur" },
};

export const DRUG_LINK_MAP: Record<string, DrugRoute> = {
  ...GENERATED_DRUG_LINK_MAP,
  ...MANUAL_OVERRIDES,
};

export function getDrugRouteByName(name: string): DrugRoute | null {
  const key = name.trim();

  // 1. thử khớp nguyên văn trướcrenderSymptomaticTreatment
  const direct = DRUG_LINK_MAP[key];
  if (direct) return direct;

  // 2. cắt phần trong ngoặc: "Tulatromycin (cho ...)" -> "Tulatromycin"
  const beforeParen = key.split(" (")[0].trim();
  if (beforeParen && DRUG_LINK_MAP[beforeParen]) {
    return DRUG_LINK_MAP[beforeParen];
  }

  // 3. cắt phần mô tả sau dấu " - "
  const beforeDash = key.split(" - ")[0].trim();
  if (beforeDash && DRUG_LINK_MAP[beforeDash]) {
    return DRUG_LINK_MAP[beforeDash];
  }

  return null;
}

