import { answerLengthLogProbs } from "../data/answerLengths.js";
import { featureLinkers } from "../features/index.js";
import { Distribution } from "../lib/distribution.js";
import { LengthDistribution } from "../lib/lengthDistribution.js";
import type { Wordlist } from "../lib/wordlist.js";
import type { Linker } from "../linker.js";
import { lengthLinker } from "./length.js";

/** All linkers. */
export function allLinkers(wordlist: Wordlist): Linker[] {
  return [
    ...featureLinkers(wordlist),
    lengthLinker(
      new LengthDistribution(new Distribution(answerLengthLogProbs)),
    ),
  ];
}
