import { LETTERS } from "../lib/letterDistribution.js";
import { interval, mapProduct } from "../lib/util.js";
import type { Feature } from "./index.js";

// TODO:
// - scrabble score equal to [1..30]
// - has equal numbers of dots and dashes in morse code
// - has [1..30] { dots, dashes, dots and dashes } in morse code
// - is a hill word (alpha, then reverse alpha)
// - is a valley word (reverse alpha, then alpha)
// - alternates vowels and consonants

function hasAtIndex(letter: string, index: number): Feature {
  const textIndex = (index >= 0 ? index + 1 : index).toString();
  return {
    name: `has ${letter} at index ${textIndex}`,
    property: (slug) => {
      return slug.at(index) === letter
        ? `index(${slug}, ${textIndex}) = ${letter}`
        : null;
    },
  };
}

function palindrome(): Feature {
  return {
    name: "is palindrome",
    property: (slug) => {
      for (let i = 0, j = slug.length - 1; i < j; i++, j--) {
        if (slug[i] !== slug[j]) return null;
      }
      return `${slug} reversed = ${slug}`;
    },
  };
}

function almostPalindrome(): Feature {
  return {
    name: "is almost palindrome",
    property: (slug) => {
      let mismatches = 0;
      for (let i = 0, j = slug.length - 1; i < j; i++, j--) {
        if (slug[i] !== slug[j]) mismatches++;
      }
      return mismatches === 1
        ? `${slug} reversed = ${slug.split("").reverse().join("")}`
        : mismatches === 0
          ? `${slug} reversed = ${slug}`
          : null;
    },
  };
}

/** Features that don't fit elsewhere. */
export function otherFeatures(): Feature[] {
  return [
    ...mapProduct(hasAtIndex, LETTERS, interval(-5, 9)),
    palindrome(),
    almostPalindrome(),
  ];
}
