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
        return result ? [`${word}: ${result}`] : [];
      });
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
  return {
    name,
    logProb: wordlist.logProb((word) => property(word) !== null),
    property,
  };
}

/**
 * Create a binomial linker for a set of features. Returns a binomial link for
 * satisfying any feature in the set.
 */
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
        const properties = features.flatMap((feature) => {
          const property = feature.property(word);
          return property ? [property] : [];
        });
        return properties.length > 0
          ? [`${word}: ${properties.join(", ")}`]
          : [];
      });
      const logProb = LogNum.binomialPValue(
        description.length,
        words.length,
        successProb,
      );
      return [
        {
          name: `${name} (${description.length.toString()} / ${words.length.toString()})`,
          description,
          logProb,
        },
      ];
    },
  };
}

/**
 * Return the linker for a set of features, and a linker for satisfying any
 * feature.
 */
export function withAnyOfFeatureLinker({
  name,
  features,
}: {
  name: string;
  features: Feature[];
}): Linker[] {
  return [
    ...features.map((feature) => featureLinker(feature)),
    anyOfFeatureLinker({ name, features }),
  ];
}
