import type { LengthDistribution } from "../lib/lengthDistribution.js";
import type { Linker } from "../linker.js";

// - all the same, all odd/even, all equal mod 3, consecutive values, all different
//   - arithmetic sequence lengths
// - pair by lengths
//   - https://puzzles.mit.edu/2012/puzzles/a_circus_line/solution/

/** Length-based linker. */
export function lengthLinker(distribution: LengthDistribution): Linker {
  return {
    name: "slug lengths",
    eval: (words) => {
      const lengths = words.map((w) => w.length);
      const lengthSet = new Set(lengths);
      const results = [];

      if (lengthSet.size === 1) {
        const [length] = Array.from(lengthSet) as [number];
        results.push({
          name: "all lengths equal",
          logProb: distribution.probEqual(words.length),
          description: [`all lengths are ${length.toString()}`],
        });
      } else if (lengthSet.size === 2) {
        const [a, b] = Array.from(lengthSet) as [number, number];
        const aLength = words.filter((w) => w.length === a);
        const bLength = words.filter((w) => w.length === b);
        const aLogProb = distribution.probEqual(aLength.length);
        const bLogProb = distribution.probEqual(bLength.length);
        results.push({
          name: "only two lengths",
          logProb: aLogProb.mul(bLogProb),
          description: [
            `length ${a.toString()}: ${aLength.join(", ")}`,
            `length ${b.toString()}: ${bLength.join(", ")}`,
          ],
        });
      }

      if (new Set(lengths.map((l) => l % 2)).size === 1) {
        const parity = lengths[0]! % 2;
        results.push({
          name: `all lengths are ${parity === 0 ? "even" : "odd"}`,
          logProb: distribution.probEqualMod2(words.length),
          description: [`all lengths are ${parity === 0 ? "even" : "odd"}`],
        });
      }
      if (new Set(lengths.map((l) => l % 3)).size === 1) {
        results.push({
          name: "all lengths are equal mod 3",
          logProb: distribution.probEqualMod3(words.length),
          description: ["all lengths are equal mod 3"],
        });
      }

      if (lengthSet.size === words.length) {
        if (Math.max(...lengths) - Math.min(...lengths) === words.length - 1) {
          results.push({
            name: "lengths are consecutive",
            logProb: distribution.probArithSeq(words.length),
            description: ["lengths are consecutive"],
          });
        }
      }

      return results;
    },
  };
}
