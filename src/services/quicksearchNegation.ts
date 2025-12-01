// src/services/quicksearchNegation.ts

// Tạm thời viết hàm normalize đơn giản, có thể dùng lại hàm normalize hiện tại của bro
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Những triệu chứng LỚN được phép bị phủ định
const NEGATABLE_SYMPTOMS = ["tiêu chảy", "ho", "khó thở", "vàng da", "có ve"];

// Các cụm phủ định đã được gom về "không" trong goat.json, pig.json...
// Nhưng để chắc ăn, mình vẫn detect thêm ở đây
const NEGATION_PHRASES = ["không", "ko"];

// TODO: lát nữa mình sẽ gắn keywordDict thực tế vào đây
// tạm để kiểu này để bro nhìn được cấu trúc hàm trước
export type ParsedQuery = {
  symptomsQuery: string[];
  negatedSymptoms: string[];
};

/**
 * Tạm thời: hàm này nhận list "canonical tokens" đã dịch sẵn
 * Ví dụ sau lớp synonyms:
 *   ["không", "tiêu chảy", "sốt cao"] hoặc ["bỏ ăn", "sốt cao"]
 * Rồi tách thành 2 túi: symptomsQuery & negatedSymptoms
 */
export function splitSymptomsAndNegation(canonicalTokens: string[]): ParsedQuery {
  const symptomsQuery: string[] = [];
  const negatedSymptoms: string[] = [];

  // 1) Gom tất cả triệu chứng vào symptomsQuery (trừ từ phủ định)
  for (const token of canonicalTokens) {
    if (NEGATION_PHRASES.includes(token)) continue; // bỏ "không", "ko"
    symptomsQuery.push(token);
  }

  // 2) Bắt pattern: "không/ko" + TRIỆU CHỨNG LỚN (tiêu chảy, ho...)
  for (let i = 0; i < canonicalTokens.length - 1; i++) {
    const curr = canonicalTokens[i];
    const next = canonicalTokens[i + 1];

    if (NEGATION_PHRASES.includes(curr) && NEGATABLE_SYMPTOMS.includes(next)) {
      negatedSymptoms.push(next);
    }
  }

  return { symptomsQuery, negatedSymptoms };
}
