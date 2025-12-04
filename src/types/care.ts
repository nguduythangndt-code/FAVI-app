// src/types/care.ts

// Các loài trong mục Care
export type CareAnimal = "goat" | "pig" | "cattle" | "chicken";

// careId: phải trùng id trong list.json + key trong care.ts + tên file json
export type CareId =
  // GOAT
  | "goat_fattening"
  | "goat_doe"
  | "goat_replacement"
  | "goat_kid"
  | "goat_sick"
  | "goat_recovery"
  | "goat_housing"
  | "goat_silage"
  // PIG
  | "pig_fattening"
  | "pig_sow"
  | "pig_gilt"
  | "pig_piglet"
  | "pig_sick"
  | "pig_recovery"
  | "pig_housing"
  | "pig_feeding"
  // CATTLE
  | "cattle_fattening"
  | "cattle_cow"
  | "cattle_replacement"
  | "cattle_calf"
  | "cattle_sick"
  | "cattle_recovery"
  | "cattle_housing"
  | "cattle_silage"
  // CHICKEN
  | "chicken_broiler"
  | "chicken_layer"
  | "chicken_chick"
  | "chicken_sick"
  | "chicken_recovery"
  | "chicken_housing"
  | "chicken_litter";

// Dòng trong list.json (màn danh sách Care theo loài)
// Data hiện tại đang dùng: { id, name, shortDesc }
export interface CareTopicSummary {
  id: CareId;        // ví dụ: "goat_fattening"
  name?: string;
  shortDesc?: string;

  // Mở đường cho tương lai nếu sau này muốn đổi sang title/description
  title?: string;
  description?: string;

  // Cho phép thêm field phụ (icon, order, tag...)
  [key: string]: any;
}

// Mỗi mục con trong chi tiết (nhập đàn, giai đoạn, lưu ý...)
export interface CareSection {
  id: string;       // "new_stock" | "stabilize" | "vaccination" ...
  title: string;    // Tiêu đề hiển thị
  body: string[];   // Mỗi phần tử = 1 gạch đầu dòng / đoạn ngắn
}

// Chi tiết 1 mục Care (vỗ béo, mẹ, con, hậu bị, chuồng trại...)
export interface CareDetail {
  id: CareId;            // trùng careId + tên file json
  animal: CareAnimal;    // "goat" | "pig" | ...
  title: string;         // "Chăm sóc dê vỗ béo"
  summary?: string;
  sections?: CareSection[];
  warnings?: string[];

  // Cho phép JSON có thêm trường khác nếu cần
  [key: string]: any;
}
