/**
 * A class that uses a single bigint to store counts for each lowercase letter,
 * for fast-ish comparison.
 */
export class LetterBitset {
  private static readonly bits = 5n;
  private static readonly mask = (1n << LetterBitset.bits) - 1n;
  private static readonly offsets = Array(26)
    .fill(0)
    .map((_, i) => LetterBitset.bits * BigInt(i));
  private static readonly letterMasks = LetterBitset.offsets.map(
    (x) => 1n << x,
  );

  /**
   * This is a (26 * 5)-bit integer; each 5-bit block is a count for a letter.
   * Unclear how efficient this'll be for different engines...
   */
  readonly data: bigint;

  constructor(data: bigint) {
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
      data += LetterBitset.letterMasks[this.toIndex(char)]!;
    }
    return new LetterBitset(data);
  }

  index(letter: string) {
    return Number(
      (this.data >> LetterBitset.offsets[LetterBitset.toIndex(letter)]!) &
        LetterBitset.mask,
    );
  }

  equals(other: LetterBitset) {
    return this.data === other.data;
  }

  /** If this + result == other, return result; else null. */
  transaddOf(other: LetterBitset) {
    const diff = this.data - other.data;
    const index = LetterBitset.letterMasks.findIndex((mask) => diff === mask);
    if (index === -1) {
      return null;
    }
    return LetterBitset.fromIndex(index);
  }

  /** If this - result == other, return result; else null. */
  transdeleteOf(other: LetterBitset) {
    return other.transaddOf(this);
  }
}
