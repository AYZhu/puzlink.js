import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

const dataDir = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
);

const tsDir = path.join(dataDir, "categories");
const txtDir = path.join(dataDir, "categories", "txt");

for (const txtFileName of await fs.readdir(txtDir)) {
  const tsFilePath = path.join(tsDir, txtFileName.replace(".txt", ".ts"));
  console.log(`writing ${tsFilePath}`);
  const txtLines = (await fs.readFile(path.join(txtDir, txtFileName), "utf-8"))
    .split("\n")
    .filter((line) => line.length > 0);
  const tsLines = [];
  tsLines.push(`export default [`);
  for (const line of txtLines) {
    tsLines.push(`  "${line}",`);
  }
  tsLines.push(`];`);
  await fs.writeFile(tsFilePath, tsLines.join("\n"), "utf-8");
}
