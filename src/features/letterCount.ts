import { CONSONANTS, LETTERS, VOWELS } from "../lib/letterDistribution.js";
import { capitalizeAt, interval, mapProduct } from "../lib/util.js";
import type { Feature } from "./index.js";

function withTimes(letter: string, times: number, strict: boolean): Feature {
  return {
    name: strict
      ? `has ${times.toString()} ${letter}`
      : `has at least ${times.toString()} ${letter}`,
    property: (slug) => {
      const starts = interval(0, slug.length - 1).filter((i) => {
        return slug[i] === letter;
      });
      if (strict ? starts.length !== times : starts.length < times) {
        return null;
      }
      return capitalizeAt(slug, [...starts]);
    },
  };
}

function uniqueOf(
  kind: { name: string; letters: string },
  times: number,
): Feature {
  return {
    name: `has ${times.toString()} unique ${kind.name}`,
    property: (slug) => {
      const unique = new Set<string>();
      for (const letter of slug) {
        if (kind.letters.includes(letter)) {
          unique.add(letter);
        }
      }
      if (unique.size !== times) {
        return null;
      }
      return `${slug} ${kind.name}: ${Array.from(unique.values()).sort().join("")}`;
    },
  };
}

function nGramRepeatsTimes(
  kind: { name: string; n: number },
  count: number,
  repeats: number,
  strict: boolean,
): Feature {
  return {
    name: strict
      ? `has ${count.toString()} ${kind.name}, each repeating ${repeats.toString()} times`
      : `has ${count.toString()} ${kind.name}, each repeating at least ${repeats.toString()} times`,
    property: (slug) => {
      const counts = new Map<string, number>();
      for (let i = 0; i < slug.length - kind.n + 1; i++) {
        const nGram = slug.slice(i, i + kind.n);
        counts.set(nGram, (counts.get(nGram) ?? 0) + 1);
      }
      const nGrams = [];
      for (const [nGram, count] of counts) {
        if (strict ? count === repeats : count >= repeats) {
          nGrams.push(nGram);
        }
      }
      if (nGrams.length !== count) {
        return null;
      }
      return `${slug}: ${nGrams.join(", ")}`;
    },
  };
}

function repeatedOf(kind: { name: string; letters: string }): Feature {
  return {
    name: `has repeated ${kind.name}`,
    property: (slug) => {
      const counts = new Map<string, number>();
      for (const letter of slug) {
        if (kind.letters.includes(letter)) {
          counts.set(letter, (counts.get(letter) ?? 0) + 1);
        }
      }
      const repeated = [];
      for (const [letter, count] of counts) {
        if (count >= 2) {
          repeated.push(letter);
        }
      }
      return repeated.length > 0 ? `${slug}: ${repeated.join(", ")}` : null;
    },
  };
}

function equalCounts(): Feature {
  return {
    name: "has equal letter counts",
    property: (slug) => {
      const counts = new Map<string, number>();
      for (const letter of slug) {
        counts.set(letter, (counts.get(letter) ?? 0) + 1);
      }
      const countSet = new Set(counts.values());
      return countSet.size === 1
        ? `${slug} letter counts are all ${Array.from(countSet)[0]!.toString()}`
        : null;
    },
  };
}

function twoCounts(): Feature {
  return {
    name: "has one of two letter counts",
    property: (slug) => {
      const counts = new Map<string, number>();
      for (const letter of slug) {
        counts.set(letter, (counts.get(letter) ?? 0) + 1);
      }
      const countSet = new Set(counts.values());
      if (countSet.size !== 2) {
        return null;
      }
      const [a, b] = Array.from(countSet) as [number, number];
      const aLetters = [];
      const bLetters = [];
      for (const [letter, count] of counts) {
        if (count === a) {
          aLetters.push(letter);
        } else if (count === b) {
          bLetters.push(letter);
        }
      }
      return `${slug} letter counts are ${a.toString()} (${aLetters.sort().join("")}) or ${b.toString()} (${bLetters.sort().join("")})`;
    },
  };
}

function arithmeticSequenceCounts(): Feature {
  return {
    name: "has letter counts in arithmetic sequence",
    property: (slug) => {
      const counts = new Map<string, number>();
      for (const letter of slug) {
        counts.set(letter, (counts.get(letter) ?? 0) + 1);
      }
      const sortedCounts = Array.from(counts.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      return sortedCounts.every(([, c], i) => c === sortedCounts[0]![1] + i)
        ? `${slug} letter counts of ${sortedCounts.map(([l]) => l).join(", ")} are ${sortedCounts.map(([, c]) => c).join(", ")}`
        : null;
    },
  };
}

/**
 * Features for letter counts: things we can remark solely based on the
 * histogram of letters/bigrams/trigrams in the slug.
 */
export function letterCountFeatures(): Feature[] {
  return [
    ...mapProduct(withTimes, LETTERS, interval(1, 5), [true, false]),
    ...mapProduct(
      uniqueOf,
      [{ name: "vowels", letters: VOWELS }],
      interval(1, 5),
    ),
    ...mapProduct(
      uniqueOf,
      [{ name: "consonants", letters: CONSONANTS }],
      interval(1, 15),
    ),
    ...mapProduct(
      uniqueOf,
      [{ name: "letters", letters: LETTERS }],
      interval(1, 26),
    ),
    ...mapProduct(
      nGramRepeatsTimes,
      [
        { name: "letters", n: 1 },
        { name: "bigrams", n: 2 },
        { name: "trigrams", n: 3 },
      ],
      interval(1, 5),
      interval(2, 4),
      [true, false],
    ),
    ...mapProduct(repeatedOf, [
      { name: "vowels", letters: VOWELS },
      { name: "consonants", letters: CONSONANTS },
    ]),
    equalCounts(),
    twoCounts(),
    arithmeticSequenceCounts(),
  ];
}
