import { featureLinkers } from "../features/index.js";
import type { Wordlist } from "../lib/wordlist.js";
import type { Linker } from "../linker.js";
import { lengthLinkers } from "./length.js";

/** All linkers. */
export function allLinkers(wordlist: Wordlist): Linker[] {
  return [...featureLinkers(wordlist), ...lengthLinkers()];
}
