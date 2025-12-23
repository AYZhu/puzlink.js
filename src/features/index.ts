import { featureLinker } from "../feature.js";
import { Wordlist } from "../lib/wordlist.js";
import type { Linker } from "../linker.js";
import { otherFeatures } from "./other.js";
import { wordplayFeatures } from "./wordplay.js";

/** Feature-based linkers. */
export function featureLinkers(wordlist: Wordlist): Linker[] {
  return [...wordplayFeatures(wordlist), ...otherFeatures(wordlist)].map(
    (feature) => featureLinker(feature),
  );
}
