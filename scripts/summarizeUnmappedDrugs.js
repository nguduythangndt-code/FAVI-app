// scripts/summarizeUnmappedDrugs.js
// Đọc unmapped-drugs.json và gom nhóm theo value, đếm tần suất + ví dụ

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname + "/..";
const inputPath = path.join(projectRoot, "scripts", "unmapped-drugs.json");
const outputPath = path.join(projectRoot, "scripts", "unmapped-drugs-summary.json");

if (!fs.existsSync(inputPath)) {
  console.error("Không tìm thấy scripts/unmapped-drugs.json. Hãy chạy:");
  console.error("  npm run scan:treatment-drugs");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const items = JSON.parse(raw);

const normalize = (s) => s.toLowerCase().trim();

const map = new Map();

for (const item of items) {
  const norm = normalize(item.value);
  if (!map.has(norm)) {
    map.set(norm, {
      value: item.value,        // giữ 1 bản gốc đầu tiên để nhìn cho dễ
      norm,
      count: 0,
      examples: [],
    });
  }
  const entry = map.get(norm);
  entry.count += 1;

  if (entry.examples.length < 5) {
    entry.examples.push({
      animal: item.animal,
      group: item.group,
      diseaseId: item.diseaseId,
      field: item.field,
    });
  }
}

// chuyển sang array và sort theo count giảm dần
const summary = Array.from(map.values()).sort((a, b) => b.count - a.count);

fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), "utf8");

console.log(`Tổng số mẫu value khác nhau: ${summary.length}`);
console.log(`Đã lưu tại: ${outputPath}\n`);

console.log("Top 30 chuỗi xuất hiện nhiều nhất:\n");
summary.slice(0, 30).forEach((entry, idx) => {
  console.log(
    `${idx + 1}. (${entry.count} lần) "${entry.value}"`
  );
});
