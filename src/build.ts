import { Wordlist } from "./lib/wordlist.js";
import { Puzlink } from "./index.js";
import { knownLogProbs } from "./data/knownLogProbs.js";

// Clear cache, so we recompute.
for (const key in knownLogProbs) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete knownLogProbs[key];
}

// TODO: make this a real script, one that either regenerates
// ./data/knownLogProbs.js entirely, or just adds the new ones
new Puzlink(await Wordlist.download());
