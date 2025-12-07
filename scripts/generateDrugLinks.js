// scripts/generateDrugLinks.js

const fs = require("fs");
const path = require("path");

// thư mục gốc project (file này nằm trong scripts/)
const ROOT = path.join(__dirname, "..");

// đường dẫn tới list nhóm thuốc
const groupListPath = path.join(
  ROOT,
  "app",
  "data",
  "drugs",
  "group",
  "list.json"
);

const groupList = JSON.parse(fs.readFileSync(groupListPath, "utf8"));

const lines = [];
lines.push(
  'export type DrugRoute = { group: string; id: string };',
  "",
  "export const GENERATED_DRUG_LINK_MAP: Record<string, DrugRoute> = {"
);

// duyệt từng nhóm thuốc
for (const group of groupList) {
  const groupId = group.id; // ví dụ: antibiotic, electrolyte...
  const listPath = path.join(ROOT, "app", "data", "drugs", groupId, "list.json");

  if (!fs.existsSync(listPath)) {
    console.warn("Không tìm thấy list thuốc cho group:", groupId);
    continue;
  }

  const drugList = JSON.parse(fs.readFileSync(listPath, "utf8"));

  for (const item of drugList) {
    const id = item.id;
    const name = item.name;

    if (!id || !name) continue;

    // escape dấu "
    const safeName = String(name).replace(/"/g, '\\"');

    lines.push(
      `  "${safeName}": { group: "${groupId}", id: "${id}" },`
    );
  }
}

lines.push("};", "");

const outPath = path.join(
  ROOT,
  "src",
  "constants",
  "generatedDrugLinks.ts"
);

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("✅ Đã tạo:", outPath);
