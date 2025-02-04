import { Cromulence, loadWordlist, zipfToLogProb } from "cromulence";
import { LetterCounter } from "./letterCounter.js";
import { LogNum } from "./logNum.js";

/**
 * We assume (as in `cromulence`) that words appearing in puzzles are
 * distributed via Zipf frequency.
 */
export class Wordlist {
  private cromulence: Cromulence;
  private letterCounters = new Map<bigint, string>();

  constructor(wordlist: Record<string, number>) {
    this.cromulence = new Cromulence(wordlist);
    for (const word of Object.keys(this.cromulence.wordlist)) {
      this.letterCounters.set(LetterCounter.from(word).data, word);
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
    return this.reduce(LogNum.fromFraction(0, 1), (acc, slug, zipf) => {
      if (!property(slug)) {
        return acc;
      }
      return acc.add(new LogNum(zipfToLogProb(zipf)));
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
    return this.letterCounters.get(LetterCounter.from(slug).data) || null;
  }

  /** Returns if slug is the transadd of other + letter, else null. */
  isTransadd(slug: string) {
    const counter = LetterCounter.from(slug);
    for (const [otherCount, other] of this.letterCounters) {
      const letter = counter.transaddOf(new LetterCounter(otherCount));
      if (letter) {
        return { other, letter };
      }
    }
    return null;
  }

  /** Returns if slug is the transdelete of other - letter, else null. */
  isTransdelete(slug: string) {
    const counter = LetterCounter.from(slug);
    for (const [otherCount, other] of this.letterCounters) {
      const letter = counter.transdeleteOf(new LetterCounter(otherCount));
      if (letter) {
        return { other, letter };
      }
    }
    return null;
  }
}
