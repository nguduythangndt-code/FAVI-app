// src/services/diseaseDetailService.ts

import { diseaseRegistry } from "../generated/diseaseRegistry.generated";

export type DiseaseDetail = {
  name: string;

  // ===== SCHEMA CŨ =====
  cause?: string;
  symptoms?: string;
  treatment?: {
    mild?: string;
    severe?: string;
    alternative?: string;
    note?: string;

    // ===== MỞ RỘNG SCHEMA MỚI =====
    primary_drugs?: string[];
    alternative_drugs?: string[];
      note_drugs?: string[];   // ⬅️ mới thêm

    symptomatic_treatment?: {
      [key: string]:
        | {
            main: string;
            alternative?: string | string[];
          }
        | string[];
    };
    supportive_care?: string[];
    dose_policy?: string;
  };

  prevention?: string | string[];

  // ===== SCHEMA MỚI =====
  summary?: string;
  causes?: string[];
  risk_factors?: string[];
  clinical_signs_detailed?: string[];
  clinical_signs_by_stage?: {
    mild?: string[];
    moderate?: string[];
    severe?: string[];
  };

  severe_case_treatment?: {
    case_type_1?: any;
    case_type_2?: any;
    note?: string;
  };

  prevention_list?: string[];
  notes?: string[];

  disclaimer?: string;
};

function normalizeGroup(group: string): string {
  // Cho chắc: hỗ trợ cả "blood-parasite" lẫn "blood_parasite"
  if (group === "blood-parasite") return "blood_parasite";
  return group;
}

/**
 * Lấy chi tiết bệnh theo animal/group/id.
 * Dùng registry auto-generated từ scripts/buildDiseaseRegistry.js
 */
export function getDiseaseDetail(
  animal: string,
  group: string,
  id: string
): DiseaseDetail | null {
  if (!animal || !group || !id) return null;

  const normGroup = normalizeGroup(group);
  const key = `${animal}/${normGroup}/${id}`;

  const loader = (diseaseRegistry as any)[key] as
    | (() => DiseaseDetail)
    | undefined;

  if (!loader) {
    console.warn("[getDiseaseDetail] Không tìm thấy key:", key);
    return null;
  }

  try {
    const detail = loader();
    return detail as DiseaseDetail;
  } catch (err) {
    console.warn("[getDiseaseDetail] Lỗi load detail cho key:", key, err);
    return null;
  }
}
