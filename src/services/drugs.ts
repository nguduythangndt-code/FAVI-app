// src/services/drugs.ts
import groupList from "../../app/data/drugs/group/list.json";
import type {
  DrugGroupId,
  DrugGroupItem,
  DrugListItem,
  DrugDetail,
} from "../types/drugs";
import { drugRegistry } from "../generated/drugRegistry";

// ====== GROUP LIST ======
export function loadDrugGroups(): DrugGroupItem[] {
  return groupList as DrugGroupItem[];
}

// ====== LIST THEO NHÓM ======
export function loadDrugListByGroup(
  group: DrugGroupId
): DrugListItem[] {
  switch (group) {
    case "electrolyte":
      return require("../../app/data/drugs/electrolyte/list.json");
    case "antiinflammatory_analgesic":
      return require(
        "../../app/data/drugs/antiinflammatory_analgesic/list.json"
      );
    case "vitamin_tonic":
      return require("../../app/data/drugs/vitamin_tonic/list.json");
    case "antiparasitic_internal":
      return require(
        "../../app/data/drugs/antiparasitic_internal/list.json"
      );
    case "antiparasitic_external":
      return require(
        "../../app/data/drugs/antiparasitic_external/list.json"
      );
    case "respiratory_support":
      return require(
        "../../app/data/drugs/respiratory_support/list.json"
      );
    case "digestive_support":
      return require(
        "../../app/data/drugs/digestive_support/list.json"
      );
    case "blood_parasite":
      return require(
        "../../app/data/drugs/blood_parasite/list.json"
      );
    case "antibiotic":
      return require("../../app/data/drugs/antibiotic/list.json");
    default:
      return [];
  }
}

// ====== CHI TIẾT THUỐC – DÙNG REGISTRY ======
export function loadDrugDetail(
  group: DrugGroupId,
  id: string
): DrugDetail | null {
  const key = `${group}/${id}`;
  const loader = (drugRegistry as any)[key];

  if (!loader) {
    console.warn("Drug detail not found in registry:", key);
    return null;
  }

  try {
    const data = loader();
    const detail = data as DrugDetail;

    // Bổ sung id & group nếu file json chưa khai báo
    if (!detail.id) {
      detail.id = id;
    }
    if (!detail.group) {
      detail.group = group;
    }

    return detail;
  } catch (e) {
    console.warn("Error loading drug detail:", key, e);
    return null;
  }
}
