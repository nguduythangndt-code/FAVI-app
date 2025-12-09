// src/types/drugs.ts

// Tất cả group thuốc đang có trong app
export type DrugGroupId =
  | "antibiotic"
  | "antiinflammatory_analgesic"
  | "electrolyte"
  | "vitamin_tonic"
  | "antiparasitic_internal"
  | "antiparasitic_external"
  | "respiratory_support"
  | "digestive_support"
  | "blood_parasite"
  | "disinfectant_hygiene"
  | "hormone";


// Dùng cho app/data/drugs/group/list.json
export interface DrugGroupItem {
  id: DrugGroupId;
  name: string;
}

// Dùng cho <group>/list.json
export interface DrugListItem {
  id: string;
  name: string;
}

// Dùng cho file chi tiết từng thuốc <group>/<id>.json
// Gom cả schema của kháng sinh & kháng viêm – giảm đau
export interface DrugDetail {
  id?: string;
  name: string;
  group?: DrugGroupId;

  // Cơ chế
  mechanism?: string;

  // Khi nên dùng
  clinical_uses?: string[];

  // Ưu – nhược (schema 1)
  pros?: string[];
  cons?: string[];

  // Ưu – nhược (schema 2)
  advantages?: string[];
  disadvantages?: string[];

  // Tác dụng phụ
  mild_side_effects?: string[];
  side_effects?: string[];

  // Khuyến cáo dùng
  usage_recommendations?: string[];
  recommendations?: string[];

  // Khi không nên dùng
  when_not_to_use?: string[];
  contraindications?: string[];

  // Thuốc thay thế
  alternative_drugs?: string[];
  alternatives?: string[];

  // Ghi chú / disclaimer chung
  note?: string;
}
