import * as fs from "node:fs/promises";
import { Wordlist } from "../src/lib/wordlist.js";
import { Puzlink } from "../src/index.js";
import { knownLogProbs } from "../src/data/knownLogProbs.js";

const start = Date.now();

const knownLogProbsPath = new URL(
  "../src/data/knownLogProbs.ts",
  import.meta.url,
);

const regenAll = process.argv[2] === "all";

if (regenAll) {
  console.log("building all logProbs");
} else {
  console.log('building new logProbs (pass "all" to regenerate all)');
}

if (regenAll) {
  // Clear cache, so we recompute.
  for (const key in knownLogProbs) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete knownLogProbs[key];
  }
}

new Puzlink(await Wordlist.download());

const file = `
import { LogNum } from "../lib/logNum.js";

/** Computing feature LogProbs can be expensive; here are cached values. */
export const knownLogProbs: Record<string, LogNum> = {
${Object.entries(knownLogProbs)
  .map(
    ([key, value]) =>
      `  "${key}": LogNum.fromExp(${value.toLog().toString()}),`,
  )
  .join("\n")}
};
`.trimStart();

await fs.writeFile(knownLogProbsPath, file, "utf-8");

console.log(
  `built ${Object.keys(knownLogProbs).length.toString()} logProbs in ${(
    Date.now() - start
  ).toString()}ms`,
);
