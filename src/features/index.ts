import { featureLinker } from "../feature.js";
import { Wordlist } from "../lib/wordlist.js";
import type { Linker } from "../linker.js";
import { wordplayFeatures } from "./wordplay.js";

/** Feature-based linkers. */
export function featureLinkers(wordlist: Wordlist): Linker[] {
  return [...wordplayFeatures(wordlist)].map((feature) =>
    featureLinker(feature),
  );
}
