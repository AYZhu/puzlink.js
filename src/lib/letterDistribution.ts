import { cumulativeStdNormalProbability as normCdf } from "simple-statistics";
import { LogNum } from "./logNum.js";
import type { Wordlist } from "./wordlist.js";
import { LogCounter } from "./logCounter.js";

export const LETTERS = "abcdefghijklmnopqrstuvwxyz";

/**
 * Info about the letter distribution of a wordlist.
 */
export class LetterDistribution {
  /** Letter frequencies across the wordlist. */
  private readonly frequencies: ReadonlyMap<string, LogNum>;

  constructor(wordlist: Wordlist) {
    this.frequencies = wordlist.reduce(
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
  }

  private momentCache = new Map<number, LogNum>();

  private moment(k: number): LogNum {
    const cached = this.momentCache.get(k);
    if (cached) {
      return cached;
    }

    const result = LogNum.sum(
      Array.from(this.frequencies.values()).map((freq) => freq.pow(k)),
    );

    this.momentCache.set(k, result);
    return result;
  }

  /** Chi-squared test statistic against a slug's distribution. */
  private chi2(slug: string): LogNum {
    const counter = LogCounter.from(slug);
    const n = counter.total;

    return LogNum.sum(
      Array.from(this.frequencies.entries()).map(([letter, freq]) => {
        const nfreq = n.mul(freq);
        return nfreq.absSub(counter.get(letter)).pow(2).div(nfreq);
      }),
    );
  }

  /** Log probability of a slug's distribution, via chi-squared. */
  prob(slug: string): LogNum {
    const df = LETTERS.length - 1;
    const z = (this.chi2(slug).toNum() - df) / Math.sqrt(2 * df);
    return LogNum.from(1 - normCdf(z));
  }

  /** Over- and under-represented letters, at 3 sigma. */
  outliers(slug: string): {
    high: Record<string, LogNum>;
    low: Record<string, LogNum>;
  } {
    const counter = LogCounter.from(slug);
    const n = counter.total;

    const high: Record<string, LogNum> = {};
    const low: Record<string, LogNum> = {};

    for (const [letter, freq] of this.frequencies) {
      const expected = n.mul(freq);
      const actual = counter.get(letter);

      if (expected.absSub(actual).pow(2).gt(LogNum.from(4))) {
        if (expected.gt(actual)) {
          high[letter] = expected.sub(actual);
        } else {
          low[letter] = actual.sub(expected);
        }
      }
    }

    return { high, low };
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
    const p = this.moment(lengths.length).pow(common);

    return LogNum.from(1).sub(LogNum.fromExp(-p.toNum() * combos.toNum()));
  }

  // probWord(length: number): LogNum;
  //
  // probAnagram(length: number): LogNum;
  //
  // probPalindrome(length: number): LogNum;
}
