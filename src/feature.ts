import { knownLogProbs } from "./data/knownLogProbs.js";
import { LogNum } from "./lib/logNum.js";
import type { Wordlist } from "./lib/wordlist.js";
import type { Linker } from "./linker.js";

/**
 * A Feature is a property of a word that is quantified via logProb.
 *
 * Features should be as specific as possible, like "can prepend T to get a
 * word", rather than "can prepend a letter to get a word". Instead, use
 * linkers to get more general features.
 */
export type Feature = {
  name: string;
  logProb: LogNum;
  /**
   * Should be a sentence with the `word` as the subject, e.g. `can prepend A
   * to ${word} to get a word`.
   */
  property: (word: string) => string | null;
};

/**
 * Create a binomial linker for a given feature. A binomial link is the
 * probability that at least k or at most k out of n words share the feature,
 * whichever is less.
 */
export function featureLinker(feature: Feature): Linker {
  return {
    name: feature.name,
    eval: (words) => {
      const description = words.flatMap((word) => {
        const result = feature.property(word);
        return result ? [result] : [];
      });
      // Should we report the feature? This isn't entirely straightforward.
      // Super unlikely single-hits (like "can change to q" for 1/7) might
      // overwhelm less likely all-hits (like "has transadd 1" for 7/7).
      const logProb = LogNum.binomialPValue(
        description.length,
        words.length,
        feature.logProb,
      );
      return [
        {
          name: `${feature.name} (${description.length.toString()} / ${words.length.toString()})`,
          description,
          logProb,
        },
      ];
    },
  };
}

/** Create a feature for a boolean property of a word. */
export function booleanFeature({
  name,
  property,
  wordlist,
}: {
  name: string;
  property: (word: string) => string | null;
  wordlist: Wordlist;
}): Feature {
  let logProb = knownLogProbs[name];
  if (logProb !== undefined) {
    return { name, logProb, property };
  }
  logProb = wordlist.logProb((word) => property(word) !== null);
  // TODO: extract this to the build script
  console.log(`"${name}": LogNum.fromExp(${logProb.toLog().toString()}),`);
  return { name, logProb, property };
}
