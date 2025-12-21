import { slugify } from "cromulence";
import { Wordlist } from "./lib/wordlist.js";
import type { Link, Linker } from "./linker.js";
import { allLinkers } from "./linkers/index.js";

export class Puzlink {
  linkers: Linker[];

  constructor(wordlist: Wordlist) {
    this.linkers = allLinkers(wordlist);
  }

  link(words: string[], ordered?: boolean): Required<Link>[] {
    const slugs = words.map((w) => slugify(w));
    return this.linkers
      .flatMap((linker) => {
        const links = linker.eval(slugs, ordered);
        return links.map((link) => ({ name: linker.name, ...link }));
      })
      .sort((a, b) => (b.logProb.gt(a.logProb) ? 1 : -1));
  }

  bestLink(words: string[], ordered?: boolean): Required<Link> | undefined {
    return this.link(words, ordered)[0];
  }
}
