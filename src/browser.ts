import { Puzlink } from "./index.js";
import { Wordlist } from "./lib/wordlist.js";

export const puzlink = new Puzlink(await Wordlist.download());
