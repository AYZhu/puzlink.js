/**
 * A class that uses a single bigint to store counts for each lowercase letter,
 * for fast-ish comparison.
 */
export class LetterCounter {
  private static bits = 5n;
  private static mask = (1n << LetterCounter.bits) - 1n;
  private static offsets = Array(26)
    .fill(0)
    .map((_, i) => LetterCounter.bits * BigInt(i));
  private static letterMasks = LetterCounter.offsets.map((x) => 1n << x);

  /**
   * This is a (26 * 5)-bit integer; each 5-bit block is a count for a letter.
   * Unclear how efficient this'll be for different engines...
   */
  data: bigint;

  constructor(data = 0n) {
    this.data = data;
  }

  private static toIndex(letter: string) {
    return letter.charCodeAt(0) - 97;
  }

  private static fromIndex(index: number) {
    return String.fromCharCode(97 + index);
  }

  /** Create a new LetterCounter from a slug. */
  static from(slug: string) {
    let data = 0n;
    for (const char of slug) {
      data += LetterCounter.letterMasks[this.toIndex(char)];
    }
    return new LetterCounter(data);
  }

  index(letter: string) {
    return Number(
      (this.data >> LetterCounter.offsets[LetterCounter.toIndex(letter)]) &
        LetterCounter.mask,
    );
  }

  add(letter: string) {
    this.data += LetterCounter.letterMasks[LetterCounter.toIndex(letter)];
  }

  sub(letter: string) {
    this.data -= LetterCounter.letterMasks[LetterCounter.toIndex(letter)];
  }

  equals(other: LetterCounter) {
    return this.data === other.data;
  }

  /** If this + result == other, return result; else null. */
  transaddOf(other: LetterCounter) {
    const diff = this.data - other.data;
    const index = LetterCounter.letterMasks.findIndex((mask) => diff === mask);
    if (index === -1) {
      return null;
    }
    return LetterCounter.fromIndex(index);
  }

  /** If this - result == other, return result; else null. */
  transdeleteOf(other: LetterCounter) {
    return other.transaddOf(this);
  }
}
