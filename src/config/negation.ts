// src/config/negation.ts

// Token đặc biệt dùng trong hệ thống để đánh dấu "từ phủ định"
export const NEGATION_CANONICAL = "__NEGATION__";

// Các cụm "không/ko/không có/không bị..." sau normalize
// đã được gom về key "không" trong goat.json/pig.json...
export const NEGATION_KEY = "không";

// Những triệu chứng LỚN được phép bị phủ định, để đạp bệnh xuống
export const NEGATABLE_SYMPTOMS = [
  "tiêu chảy",
  "ho",
  "khó thở",
  "vàng da",
  "có ve",
  // sau này muốn thêm thì bổ sung ở đây
];
