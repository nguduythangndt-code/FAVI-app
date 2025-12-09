// scripts/fixDrugString.js
// Dùng để sửa các chuỗi tên thuốc trong PHÁC ĐỒ (treatment) từ from → to

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname + "/..";
const dataRoot = path.join(projectRoot, "app", "data");

// Loài đang dùng trong app
const ANIMALS = ["goat", "pig", "cattle", "chicken"];

// ================== CLI ARGS ==================

const fromRaw = process.argv[2];
const toRaw = process.argv[3];

if (!fromRaw || !toRaw) {
  console.error("Usage: node scripts/fixDrugString.js <from> <to>");
  console.error('Ví dụ: node scripts/fixDrugString.js "ORS" "oresol"');
  process.exit(1);
}

const normalize = (s) => s.toLowerCase().trim();

const fromNorm = normalize(fromRaw);
const toValue = toRaw; // giữ nguyên để ghi vào JSON

let totalFilesTouched = 0;
let totalReplacements = 0;

// ================== UTILS ==================

function readJsonSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc JSON:", filePath, e.message);
    return null;
  }
}

// Chỉ replace ở value là STRING, và chỉ khi == fromNorm (sau khi normalize)
function replaceInValue(value) {
  if (typeof value !== "string") return { changed: false, newValue: value };

  const norm = normalize(value);
  if (norm === fromNorm) {
    return { changed: true, newValue: toValue };
  }

  return { changed: false, newValue: value };
}

// Đi qua array / object trong 1 field treatment.*
function deepReplace(node) {
  let changed = false;

  if (Array.isArray(node)) {
    const newArr = node.map((item) => {
      if (typeof item === "string") {
        const res = replaceInValue(item);
        if (res.changed) {
          changed = true;
          totalReplacements++;
        }
        return res.newValue;
      } else if (typeof item === "object" && item !== null) {
        const { changed: subChanged, newNode } = deepReplace(item);
        if (subChanged) changed = true;
        return newNode;
      }
      return item;
    });
    return { changed, newNode: newArr };
  }

  if (typeof node === "object" && node !== null) {
    const newObj = { ...node };
    for (const key of Object.keys(newObj)) {
      const val = newObj[key];
      if (typeof val === "string") {
        const res = replaceInValue(val);
        if (res.changed) {
          changed = true;
          totalReplacements++;
        }
        newObj[key] = res.newValue;
      } else if (typeof val === "object" && val !== null) {
        const { changed: subChanged, newNode } = deepReplace(val);
        if (subChanged) changed = true;
        newObj[key] = newNode;
      }
    }
    return { changed, newNode: newObj };
  }

  // primitive khác
  return { changed: false, newNode: node };
}

// ================== MAIN ==================

(function main() {
  console.log(`Đang sửa trong treatment: "${fromRaw}" → "${toRaw}"\n`);

  for (const animal of ANIMALS) {
    const animalRoot = path.join(dataRoot, animal);
    if (!fs.existsSync(animalRoot)) continue;

    const groups = fs
      .readdirSync(animalRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const group of groups) {
      const detailDir = path.join(animalRoot, group, "detail");
      if (!fs.existsSync(detailDir)) continue;

      const files = fs
        .readdirSync(detailDir)
        .filter((f) => f.endsWith(".json"));

      for (const file of files) {
        const fullPath = path.join(detailDir, file);
        const json = readJsonSafe(fullPath);
        if (!json) continue;

        const treatment = json.treatment;
        if (!treatment) continue;

        let fileChanged = false;

        const fields = [
          "primary_drugs",
          "alternative_drugs",
          "note_drugs",
          "symptomatic_treatment",
        ];

        for (const fKey of fields) {
          if (treatment[fKey]) {
            const { changed, newNode } = deepReplace(treatment[fKey]);
            if (changed) {
              treatment[fKey] = newNode;
              fileChanged = true;
            }
          }
        }

        if (fileChanged) {
          totalFilesTouched++;
          json.treatment = treatment;
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), "utf8");
        }
      }
    }
  }

  console.log(`Hoàn tất.`);
  console.log(`File bị sửa: ${totalFilesTouched}`);
  console.log(`Số chỗ thay thế: ${totalReplacements}`);
})();
