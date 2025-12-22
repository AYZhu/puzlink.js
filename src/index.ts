import { slugify } from "cromulence";
import { Wordlist } from "./lib/wordlist.js";
import type { Link, Linker } from "./linker.js";
import { allLinkers } from "./linkers/index.js";

export class Puzlink {
  linkers: Linker[];

  constructor(wordlist: Wordlist) {
    this.linkers = allLinkers(wordlist);
  }

  parse(words: string | readonly string[]): string[] {
    if (typeof words === "string") {
      if (words.includes("\n")) {
        words = words.split("\n");
      } else if (words.includes(",")) {
        words = words.split(",");
      } else {
        words = words.split(" ");
      }
    }
    return words.map((w) => slugify(w)).filter((w) => w.length > 0);
  }

  link(words: string | readonly string[], ordered?: boolean): Required<Link>[] {
    const slugs = this.parse(words);
    return this.linkers
      .flatMap((linker) => {
        const links = linker.eval(slugs, ordered);
        return links.map((link) => ({ name: linker.name, ...link }));
      })
      .sort((a, b) => (b.logProb.gt(a.logProb) ? -1 : 1));
  }

  bestLink(
    words: string | readonly string[],
    ordered?: boolean,
  ): Required<Link> | undefined {
    return this.link(words, ordered)[0];
  }
}
