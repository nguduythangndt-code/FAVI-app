// scripts/buildDiseaseRegistry.js

const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const dataRoot = path.join(projectRoot, "app", "data");
const outputPath = path.join(
  projectRoot,
  "src",
  "generated",
  "diseaseRegistry.generated.ts"
);

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function buildRegistry() {
  /** @type {{ key: string; requirePath: string }[]} */
  const entries = [];

  if (!fs.existsSync(dataRoot)) {
    console.error("[buildDiseaseRegistry] Không tìm thấy thư mục:", dataRoot);
    return entries;
  }

  const animals = fs.readdirSync(dataRoot);

  for (const animal of animals) {
    const animalPath = path.join(dataRoot, animal);
    if (!isDirectory(animalPath)) continue;

    const groups = fs.readdirSync(animalPath);

    for (const group of groups) {
      const detailDir = path.join(animalPath, group, "detail");
      if (!isDirectory(detailDir)) continue;

      const files = fs
        .readdirSync(detailDir)
        .filter((f) => f.toLowerCase().endsWith(".json"));

      for (const file of files) {
        const id = file.replace(/\.json$/i, "");
        const key = `${animal}/${group}/${id}`;

        // Đường dẫn dùng trong require: từ src/generated/... ra tới app/data
        const requirePath = `../../app/data/${animal}/${group}/detail/${file}`;

        entries.push({ key, requirePath });
      }
    }
  }

  return entries;
}

function generateFile(entries) {
  // Sắp xếp cho ổn định (dễ diff)
  entries.sort((a, b) => a.key.localeCompare(b.key));

  const header = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Được sinh bởi scripts/buildDiseaseRegistry.js
// Mỗi entry map "animal/group/id" -> require(file JSON tương ứng)

export type DiseaseDetailLoader = () => any;

export const diseaseRegistry: Record<string, DiseaseDetailLoader> = {
`;

  const body =
    entries
      .map(
        (e) =>
          `  "${e.key}": () => require("${e.requirePath}"),`
      )
      .join("\n") + "\n";

  const footer = `};
`;

  const content = header + body + footer;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, { encoding: "utf8" });

  console.log(
    `[buildDiseaseRegistry] Generated ${entries.length} entries -> ${outputPath}`
  );
}

function main() {
  const entries = buildRegistry();
  generateFile(entries);
}

main();
