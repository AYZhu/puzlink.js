import { LogNum } from "../lib/logNum.js";
import type { Linker } from "../linker.js";

// - all the same, all odd/even, all equal mod 3, consecutive values, all different
//   - arithmetic sequence lengths
// - pair by lengths
//   - https://puzzles.mit.edu/2012/puzzles/a_circus_line/solution/

// TODO: build a distribution of answer lengths;
// for now we just use a heuristic.

function allSameLength(): Linker {
  return {
    name: "all same length",
    eval: (words) => {
      const lengths = new Set(words.map((w) => w.length));
      return lengths.size === 1
        ? [
            {
              logProb: LogNum.from(0.2).pow(words.length).mul(LogNum.from(4)),
              description: ["all same length"],
            },
          ]
        : [];
    },
  };
}

export function lengthLinkers(): Linker[] {
  return [allSameLength()];
}
