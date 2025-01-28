/**
 * A class that uses a single bigint to store counts for each lowercase letter.
 */
export class LetterCounter {
  static bits = 5n;
  static mask = (1n << LetterCounter.bits) - 1n;
  static offsets = Array(26)
    .fill(0)
    .map((_, i) => LetterCounter.bits * BigInt(i));
  static charMasks = LetterCounter.offsets.map((x) => 1n << x);

  private data: bigint;

  constructor(data = 0n) {
    this.data = data;
  }

  private static toIndex(char: string) {
    return char.charCodeAt(0) - 97;
  }

  private static fromIndex(index: number) {
    return String.fromCharCode(97 + index);
  }

  static from(chars: string) {
    let data = 0n;
    for (const char of chars) {
      data += LetterCounter.charMasks[this.toIndex(char)];
    }
    return new LetterCounter(data);
  }

  index(char: string) {
    return Number(
      (this.data >> LetterCounter.offsets[LetterCounter.toIndex(char)]) &
        LetterCounter.mask,
    );
  }

  add(char: string) {
    this.data += LetterCounter.charMasks[LetterCounter.toIndex(char)];
  }

  sub(char: string) {
    this.data -= LetterCounter.charMasks[LetterCounter.toIndex(char)];
  }

  equals(other: LetterCounter) {
    return this.data === other.data;
  }

  transaddOf(other: LetterCounter) {
    const diff = this.data - other.data;
    const index = LetterCounter.charMasks.findIndex((mask) => diff === mask);
    if (index === -1) {
      return null;
    }
    return LetterCounter.fromIndex(index);
  }

  transdeleteOf(other: LetterCounter) {
    return other.transaddOf(this);
  }
}
