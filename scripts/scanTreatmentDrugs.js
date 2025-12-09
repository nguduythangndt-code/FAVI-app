// scripts/scanTreatmentDrugs.js
// Mục tiêu: quét tất cả phác đồ điều trị, liệt kê các chuỗi "tên thuốc"
// không map được với danh sách thuốc trong app/data/drugs

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname + "/..";
const dataRoot = path.join(projectRoot, "app", "data");
const drugsRoot = path.join(dataRoot, "drugs");

// Nếu sau này m thêm loài, chỉ việc thêm vào đây
const ANIMALS = ["goat", "pig", "cattle", "chicken"];

// ================== 1. Đọc danh sách thuốc chuẩn ==================

function loadDrugIndex() {
  const drugIds = new Set();
  const drugNames = new Set();

  const groupListPath = path.join(drugsRoot, "group", "list.json");
  const groupList = JSON.parse(fs.readFileSync(groupListPath, "utf8"));

  for (const group of groupList) {
    const groupId = group.id;
    const listPath = path.join(drugsRoot, groupId, "list.json");
    if (!fs.existsSync(listPath)) continue;

    const list = JSON.parse(fs.readFileSync(listPath, "utf8"));
    for (const item of list) {
      if (item.id) {
        drugIds.add(item.id.toLowerCase().trim());
      }
      if (item.name) {
        drugNames.add(item.name.toLowerCase().trim());
      }
    }
  }

  return { drugIds, drugNames };
}

// ================== 2. Hàm tiện ích ==================

function readJsonSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc JSON:", filePath, e.message);
    return null;
  }
}

function collectStrings(value, cb, fieldPath) {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach((v, index) => collectStrings(v, cb, `${fieldPath}[${index}]`));
  } else if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) cb(trimmed, fieldPath);
  } else if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      collectStrings(v, cb, `${fieldPath}.${k}`);
    }
  }
}

// ================== 3. Quét phác đồ ==================

function scanTreatments(drugIds, drugNames) {
  const unmapped = [];

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
        const diseaseId = path.basename(file, ".json");
        const fullPath = path.join(detailDir, file);
        const json = readJsonSafe(fullPath);
        if (!json) continue;

        const treatment = json.treatment || {};

        // Các nhánh chính trong treatment để quét
        const fieldsToScan = {
          "treatment.primary_drugs": treatment.primary_drugs,
          "treatment.alternative_drugs": treatment.alternative_drugs,
          
        };

        for (const [fieldPath, value] of Object.entries(fieldsToScan)) {
          collectStrings(
            value,
            (str, innerPath) => {
              const simple = str.toLowerCase().trim();

              // Nếu trùng id hoặc trùng name thì coi như map được → bỏ qua
              if (drugIds.has(simple) || drugNames.has(simple)) {
                return;
              }

              // Còn lại: đưa vào danh sách "đang ghi tùm lum"
              unmapped.push({
                animal,
                group,
                diseaseId,
                field: innerPath || fieldPath,
                value: str,
              });
            },
            fieldPath
          );
        }
      }
    }
  }

  return unmapped;
}

// ================== 4. Chạy và xuất kết quả ==================

(function main() {
  const { drugIds, drugNames } = loadDrugIndex();
  console.log(
    `Đã nạp ${drugIds.size} DrugID và ${drugNames.size} tên thuốc từ module drugs.`
  );

  const unmapped = scanTreatments(drugIds, drugNames);
  console.log(
    `\nTổng số chuỗi thuốc KHÔNG map được: ${unmapped.length}\n`
  );

  // In ra vài dòng đầu để nhìn nhanh trên console
  unmapped.slice(0, 50).forEach((item) => {
    console.log(
      `${item.animal}/${item.group}/${item.diseaseId} | ${item.field}: "${item.value}"`
    );
  });

  // Lưu full ra file để soi kỹ
  const outPath = path.join(projectRoot, "scripts", "unmapped-drugs.json");
  fs.writeFileSync(outPath, JSON.stringify(unmapped, null, 2), "utf8");
  console.log(`\nĐã lưu chi tiết tại: ${outPath}`);
})();
