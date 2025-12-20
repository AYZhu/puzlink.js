import { Cromulence, loadWordlist, logProbToZipf } from "cromulence";
import { LetterBitset } from "./letterBitset.js";
import { LogNum } from "./logNum.js";
import { LETTERS } from "./letterDistribution.js";

/**
 * Info about the words in a wordlist.
 *
 * We assume (as in `cromulence`) that words appearing in puzzles are
 * distributed via Zipf frequency.
 */
export class Wordlist {
  private cromulence: Cromulence;
  private letterCounters = new Map<bigint, string[]>();

  constructor(wordlist: Record<string, number>) {
    this.cromulence = new Cromulence(wordlist);
    for (const word of Object.keys(this.cromulence.wordlist)) {
      const existing = this.letterCounters.get(LetterBitset.from(word).data);
      if (existing !== undefined) {
        existing.push(word);
        continue;
      } else {
        this.letterCounters.set(LetterBitset.from(word).data, [word]);
      }
    }
  }

  static async download(): Promise<Wordlist> {
    return new Wordlist(await loadWordlist());
  }

  /**
   * For testing purposes: create a wordlist from an array of words, each
   * equiprobable.
   */
  static from(words: string[]): Wordlist {
    const logFrac = LogNum.fromFraction(1, words.length);
    const wordlist: Record<string, LogNum> = {};
    for (const word of words) {
      if (word in wordlist) {
        wordlist[word] = wordlist[word].add(logFrac);
      } else {
        wordlist[word] = logFrac;
      }
    }
    return new Wordlist(
      Object.fromEntries(
        Object.entries(wordlist).map(([word, logProb]) => [
          word,
          logProbToZipf(logProb.toLog()),
        ]),
      ),
    );
  }

  /** Apply a reducer to each word in the wordlist. */
  reduce<T>(initial: T, reducer: (acc: T, slug: string, zipf: number) => T): T {
    return Object.entries(this.cromulence.wordlist).reduce(
      (acc, [slug, zipf]) => reducer(acc, slug, zipf),
      initial,
    );
  }

  /** Get the log prob that a wordlist item satisfies the given property. */
  logProb(property: (slug: string) => boolean): LogNum {
    return this.reduce(LogNum.from(0), (acc, slug, zipf) => {
      if (!property(slug)) {
        return acc;
      }
      return acc.add(LogNum.fromZipf(zipf));
    });
  }

  /** Returns true if the given slug is in the wordlist. */
  isWord(slug: string): boolean {
    return slug in this.cromulence.wordlist;
  }

  /** Returns true if the given phrase is in the wordlist. */
  isPhrase(phrase: string): boolean {
    return this.cromulence.cromulence(phrase) > 0;
  }

  /** Returns a word that's the anagram of the given slug, else null. */
  isAnagram(slug: string, strict = true): string | null {
    const anagrams = this.letterCounters.get(LetterBitset.from(slug).data);
    if (anagrams === undefined) {
      return null;
    }
    if (!strict) {
      return anagrams[0];
    }
    return anagrams.find((word) => word !== slug) ?? null;
  }
}
