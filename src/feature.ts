import { LogNum } from "./lib/logNum.js";
import type { Wordlist } from "./lib/wordlist.js";
import type { Linker } from "./linker.js";

/** A Feature is a property of a word that is quantified via logProb. */
export type Feature = {
  name: string;
  logProb: LogNum;
  property: (word: string) => string | null;
};

/**
 * Create a binomial linker for a given feature. That is, return a linker
 * for having k out of n words sharing a feature.
 */
export function featureLinker({ feature }: { feature: Feature }): Linker {
  return {
    name: feature.name,
    eval: (words) => {
      const description = words.flatMap((word) => {
        const result = feature.property(word);
        return result ? [`${word}: ${result}`] : [];
      });
      const logProb = LogNum.binomialPValue(
        description.length,
        words.length,
        feature.logProb,
      );
      return { description, logProb };
    },
  };
}

/** Create a binomial linker for satisfying any of the given features. */
export function anyOfFeatureLinker({
  name,
  features,
}: {
  name: string;
  features: Feature[];
}): Linker {
  return {
    name,
    eval: (words) => {
      const successProb = LogNum.from(1).sub(
        LogNum.prod(features.map((f) => LogNum.from(1).sub(f.logProb))),
      );
      const description = words.flatMap((word) => {
        for (const feature of features) {
          const result = feature.property(word);
          if (result) {
            return [`${word}: ${result}`];
          }
        }
        return [];
      });
      const logProb = LogNum.binomialPValue(
        description.length,
        words.length,
        successProb,
      );
      return { description, logProb };
    },
  };
}

/** Create a feature for a boolean property of a word. */
export function booleanFeature({
  description,
  property,
  wordlist,
}: {
  description: string;
  property: (word: string) => boolean;
  wordlist: Wordlist;
}): Feature {
  return {
    name: description,
    logProb: wordlist.logProb(property),
    property: (word: string) => (property(word) ? description : null),
  };
}

// function prependFeatures(wordlist: Wordlist) {
//   return Array.from(LETTERS).map((letter) =>
//     booleanFeature({
//       description: `can prepend ${letter} to get a word`,
//       property: (word) => wordlist.isWord(`${letter}${word}`),
//       wordlist,
//     }),
//   );
// }
//
// function makeFeatures(wordlist: Wordlist) {
//   return [
//     ...prependFeatures(wordlist).map((feature) => featureLinker({ feature })),
//     anyOfFeatureLinker({
//       name: "can prepend a letter to get a word",
//       features: prependFeatures(wordlist),
//     }),
//   ];
// }
