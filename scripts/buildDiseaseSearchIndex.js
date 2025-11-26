// scripts/buildDiseaseSearchIndex.js
// Chạy bằng:
// 1) Build 1 loài: node scripts/buildDiseaseSearchIndex.js goat
// 2) Build tất cả loài: node scripts/buildDiseaseSearchIndex.js
// 3) Qua npm script (xem package.json bên dưới)

const fs = require("fs");
const path = require("path");

// ===== NHẬN LOÀI TỪ COMMAND LINE (OPTIONAL) =====
const speciesArg = process.argv[2]; // có thể undefined

// ===== DANH SÁCH LOÀI MẶC ĐỊNH =====
const ALL_SPECIES = ["goat", "pig", "cattle", "chicken"];
const SPECIES_LIST = speciesArg ? [speciesArg] : ALL_SPECIES;

// ===== HÀM HỖ TRỢ CHUNG =====

const toPlainText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.map((v) => toPlainText(v)).join(" ");
  }
  if (typeof value === "object") {
    return Object.values(value)
      .map((v) => toPlainText(v))
      .join(" ");
  }
  return String(value);
};

// Gom các trường “triệu chứng” từ file chi tiết bệnh
const buildSearchTextFromDetail = (detailJson) => {
  const parts = [];

  // ✅ CHỈ LẤY TRIỆU CHỨNG

  // Triệu chứng chi tiết
  if (detailJson.clinical_signs_detailed) {
    parts.push(toPlainText(detailJson.clinical_signs_detailed));
  }

  // Triệu chứng theo mức độ
  if (detailJson.clinical_signs_by_stage) {
    const stage = detailJson.clinical_signs_by_stage;
    if (stage.mild) parts.push(toPlainText(stage.mild));
    if (stage.moderate) parts.push(toPlainText(stage.moderate));
    if (stage.severe) parts.push(toPlainText(stage.severe));
  }

  const raw = parts.join(" ");
  return raw.trim();
};

// Xử lý 1 nhóm của 1 loài
const processGroup = (BASE, species, groupName) => {
  const groupDir = path.join(BASE, groupName);
  const listPath = path.join(groupDir, "list.json");
  const detailDir = path.join(groupDir, "detail");

  if (!fs.existsSync(listPath)) {
    console.warn(`⚠ [${species}] Nhóm '${groupName}' không có list.json: ${listPath}`);
    return;
  }

  const raw = fs.readFileSync(listPath, "utf8");
  let list;
  try {
    list = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ [${species}] Lỗi đọc JSON ở ${listPath}:`, e.message);
    return;
  }

  if (!Array.isArray(list)) {
    console.error(`❌ [${species}] list.json của nhóm '${groupName}' không phải array!`);
    return;
  }

  console.log(`\n=== [${species}] Nhóm '${groupName}' - ${list.length} bệnh ===`);

  const updated = list.map((item) => {
    const id = item.id;
    if (!id) return item;

    const detailPath = path.join(detailDir, `${id}.json`);

    if (!fs.existsSync(detailPath)) {
      console.warn(
        `  ⚠ [${species}] Không tìm thấy detail '${id}' (${item.name}) tại: ${detailPath}`
      );
      return item;
    }

    try {
      const detailRaw = fs.readFileSync(detailPath, "utf8");
      const detailJson = JSON.parse(detailRaw);

      const searchText = buildSearchTextFromDetail(detailJson);

      if (!searchText) {
        console.warn(
          `  ⚠ [${species}] searchText rỗng cho '${id}' (${item.name}) nhóm '${groupName}'`
        );
      }

      return { ...item, searchText };
    } catch (e) {
      console.error(
        `  ❌ [${species}] Lỗi xử lý '${id}' (${item.name}) nhóm '${groupName}':`,
        e.message
      );
      return item;
    }
  });

  // backup file cũ
  const backupPath = listPath + ".bak";
  fs.writeFileSync(backupPath, raw, "utf8");
  console.log(`  → [${species}] Backup: ${backupPath}`);

  // ghi file mới
  fs.writeFileSync(listPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`  ✅ [${species}] Cập nhật searchText: ${listPath}`);
};

const getGroups = (BASE, species) => {
  if (!fs.existsSync(BASE)) {
    console.error(`❌ [${species}] Không tìm thấy BASE: ${BASE}`);
    return [];
  }

  const entries = fs.readdirSync(BASE, { withFileTypes: true });

  const groups = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  console.log(`📂 [${species}] Groups trong app/data/${species}:`);
  groups.forEach((g) => console.log("  -", g));

  return groups;
};

// ===== MAIN =====
const main = () => {
  console.log(
    speciesArg
      ? `🚀 Build searchText cho loài '${speciesArg}'...`
      : `🚀 Build searchText cho TẤT CẢ loài: ${ALL_SPECIES.join(", ")}...`
  );

  for (const species of SPECIES_LIST) {
    const BASE = path.join(__dirname, "..", "app", "data", species);
    console.log(`\n==============================`);
    console.log(`🧩 Species: ${species}`);
    console.log(`BASE: ${BASE}`);

    const groups = getGroups(BASE, species);
    groups.forEach((g) => processGroup(BASE, species, g));

    console.log(`\n✅ [${species}] Done.`);
  }

  console.log(`\n🎉 Hoàn tất build searchText.`);
};

main();
