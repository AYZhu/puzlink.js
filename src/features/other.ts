import { LETTERS } from "../lib/letterDistribution.js";
import { interval, mapProduct } from "../lib/util.js";
import type { Wordlist } from "../lib/wordlist.js";
import { booleanFeature, type Feature } from "./index.js";

// TODO:
// - scrabble score equal to [1..30]
// - has equal numbers of dots and dashes in morse code
// - has [1..30] { dots, dashes, dots and dashes } in morse code

function hasAtIndex(
  wordlist: Wordlist,
  letter: string,
  index: number,
): Feature {
  const textIndex = (index >= 0 ? index + 1 : index).toString();
  return booleanFeature({
    name: `has ${letter} at index ${textIndex}`,
    property: (word) => {
      return word.at(index) === letter
        ? `${word} has ${letter} at index ${textIndex}`
        : null;
    },
    wordlist,
  });
}

function palindrome(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "is palindrome",
    property: (word) => {
      for (let i = 0, j = word.length - 1; i < j; i++, j--) {
        if (word[i] !== word[j]) return null;
      }
      return `${word} is a palindrome`;
    },
    wordlist,
  });
}

function almostPalindrome(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "is almost palindrome",
    property: (word) => {
      let mismatches = 0;
      for (let i = 0, j = word.length - 1; i < j; i++, j--) {
        if (word[i] !== word[j]) mismatches++;
      }
      return mismatches === 1
        ? `${word} is almost a palindrome`
        : mismatches === 0
          ? `${word} is a palindrome`
          : null;
    },
    wordlist,
  });
}

/** Features that don't fit elsewhere. */
export function otherFeatures(wordlist: Wordlist): Feature[] {
  return [
    ...mapProduct(hasAtIndex, [wordlist], LETTERS, interval(-5, 9)),
    palindrome(wordlist),
    almostPalindrome(wordlist),
  ];
}
