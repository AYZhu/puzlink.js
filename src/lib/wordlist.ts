import { Cromulence, loadWordlist } from "cromulence";
import { LetterBitset } from "./letterBitset.js";
import { LogNum } from "./logNum.js";

/**
 * Info about the words in a wordlist.
 *
 * We assume (as in `cromulence`) that words appearing in puzzles are
 * distributed via Zipf frequency.
 */
export class Wordlist {
  private cromulence: Cromulence;
  private letterCounters = new Map<bigint, string>();

  constructor(wordlist: Record<string, number>) {
    this.cromulence = new Cromulence(wordlist);
    for (const word of Object.keys(this.cromulence.wordlist)) {
      this.letterCounters.set(LetterBitset.from(word).data, word);
    }
  }

  static async download() {
    return new Wordlist(await loadWordlist());
  }

  /** Apply a reducer to each word in the wordlist. */
  reduce<T>(initial: T, reducer: (acc: T, slug: string, zipf: number) => T) {
    return Object.entries(this.cromulence.wordlist).reduce(
      (acc, [slug, zipf]) => reducer(acc, slug, zipf),
      initial,
    );
  }

  /** Get the log prob that a wordlist item satisfies the given property. */
  logProb(property: (slug: string) => boolean) {
    return this.reduce(LogNum.from(0), (acc, slug, zipf) => {
      if (!property(slug)) {
        return acc;
      }
      return acc.add(LogNum.fromZipf(zipf));
    });
  }

  /** Returns true if the given slug is in the wordlist. */
  isWord(slug: string) {
    return slug in this.cromulence.wordlist;
  }

  /** Returns true if the given phrase is in the wordlist. */
  isPhrase(phrase: string) {
    return this.cromulence.cromulence(phrase) > 0;
  }

  /** Returns a word that's the anagram of the given slug, else null. */
  isAnagram(slug: string) {
    return this.letterCounters.get(LetterBitset.from(slug).data) ?? null;
  }

  /** Returns if slug is the transadd of other + letter, else null. */
  isTransadd(slug: string) {
    const counter = LetterBitset.from(slug);
    for (const [otherCount, other] of this.letterCounters) {
      const letter = counter.transaddOf(new LetterBitset(otherCount));
      if (letter) {
        return { other, letter };
      }
    }
    return null;
  }

  /** Returns if slug is the transdelete of other - letter, else null. */
  isTransdelete(slug: string) {
    const counter = LetterBitset.from(slug);
    for (const [otherCount, other] of this.letterCounters) {
      const letter = counter.transdeleteOf(new LetterBitset(otherCount));
      if (letter) {
        return { other, letter };
      }
    }
    return null;
  }
}
