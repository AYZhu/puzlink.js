import { CONSONANTS, LETTERS, VOWELS } from "../lib/letterDistribution.js";
import { capitalizeAt, interval, mapProduct } from "../lib/util.js";
import type { Feature } from "./index.js";

function hasWithTimes(letter: string, times: number, strict: boolean): Feature {
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

function hasUniqueOf(
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
      return `${slug}: ${Array.from(unique.values()).sort().join("")}`;
    },
  };
}

// TODO:
// - has exactly [1..5] {letters, bigrams, trigrams}, each of which appears exactly [2..4] times
// - has at least [1..5] {letters, bigrams, trigrams}, each of which appears at least [2..4] times
// - contains a repeated {vowel, consonant}
// - is a "pyramid word" (letters have counts A, A + 1, A + 2, ...)
// - is a "block word" (each letter has the same count)
// - is *almost* a block word (each letter has the same count, except for 1)

/**
 * Features for letter counts: things we can remark solely based on the
 * histogram of letters/bigrams/trigrams in the slug.
 */
export function letterCountFeatures(): Feature[] {
  return [
    ...mapProduct(hasWithTimes, LETTERS, interval(1, 5), [true, false]),
    ...mapProduct(
      hasUniqueOf,
      [{ name: "vowels", letters: VOWELS }],
      interval(1, 5),
    ),
    ...mapProduct(
      hasUniqueOf,
      [{ name: "consonants", letters: CONSONANTS }],
      interval(1, 15),
    ),
    ...mapProduct(
      hasUniqueOf,
      [{ name: "letters", letters: LETTERS }],
      interval(1, 26),
    ),
  ];
}
