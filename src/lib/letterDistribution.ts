import { Distribution } from "./distribution.js";
import { LogCounter } from "./logCounter.js";
import { LogNum } from "./logNum.js";
import type { Wordlist } from "./wordlist.js";

export const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const VOWELS = "aeiou";
export const CONSONANTS = "bcdfghjklmnpqrstvwxyz";

/**
 * Info about the letter distribution of a wordlist.
 */
export class LetterDistribution {
  readonly distribution: Distribution<string>;

  constructor(distribution: Distribution<string>) {
    this.distribution = distribution;
  }

  static from(wordlist: Wordlist): LetterDistribution {
    const frequencies = wordlist.reduce(
      new Map(Array.from(LETTERS).map((letter) => [letter, LogNum.from(0)])),
      (freqs, slug, zipf) => {
        const prob = LogNum.fromZipf(zipf);
        const length = LogNum.from(slug.length);
        for (const letter of slug) {
          freqs.set(letter, freqs.get(letter)!.add(prob.div(length)));
        }
        return freqs;
      },
    );
    return new LetterDistribution(new Distribution(frequencies));
  }

  /** Log probability of a slug's distribution, via chi-squared. */
  prob(slug: string): LogNum {
    const counter = LogCounter.from(slug);
    return this.distribution.prob(counter);
  }

  /** Over- and under-represented letters, at 3 sigma. */
  outliers(slug: string): {
    high: Record<string, LogNum>;
    low: Record<string, LogNum>;
  } {
    const counter = LogCounter.from(slug);
    return this.distribution.outliers(counter);
  }

  /**
   * Log probability that words of given lengths share common letters, in the
   * same order.
   */
  probCommonOrdered(common: number, lengths: number[]): LogNum {
    if (common === 0) {
      return LogNum.from(1);
    }

    const combos = LogNum.prod(
      Array(common)
        .fill(null)
        .flatMap((_, k) =>
          lengths.map((length) => LogNum.fromFraction(length - k, k + 1)),
        ),
    );
    const p = this.distribution.moment(lengths.length).pow(common);

    return LogNum.from(1).sub(LogNum.fromExp(-p.toNum() * combos.toNum()));
  }

  // probWord(length: number): LogNum;
  //
  // probAnagram(length: number): LogNum;
  //
  // probPalindrome(length: number): LogNum;
}
