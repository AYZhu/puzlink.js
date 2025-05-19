import { zipfToLogProb } from "cromulence";

/**
 * A numerically-stable-ish log(1 - exp(x)).
 *
 * Follows the algorithm in <https://cran.r-project.org/web/packages/Rmpfr/vignettes/log1mexp-note.pdf>.
 */
function log1mExp(x: number) {
  return x > -Math.log(2) ? Math.log1p(-Math.exp(x)) : Math.log(-Math.expm1(x));
}

/**
 * A numerically-stable-ish log number. Operations represent operations on
 * the numbers, not the log numbers.
 *
 * @example LogNum.from(2).add(LogNum.from(3)).toNum() // 5
 */
export class LogNum {
  private readonly data: number;

  /** Construct from the actual log number. */
  constructor(data: number) {
    this.data = data;
  }

  static from(value: number) {
    return new LogNum(Math.log(value));
  }

  static fromExp(value: number) {
    return new LogNum(value);
  }

  static fromFraction(numerator: number, denominator: number) {
    return new LogNum(Math.log(numerator) - Math.log(denominator));
  }

  private static binomialCache = new Map<number, Map<number, LogNum>>();

  static fromBinomial(n: number, k: number): LogNum {
    const cached = LogNum.binomialCache.get(n)?.get(k);
    if (cached) {
      return cached;
    }

    const result =
      n === 0 || k === 0 || k === n
        ? new LogNum(Math.log(1))
        : LogNum.fromBinomial(n - 1, k - 1).add(LogNum.fromBinomial(n - 1, k));

    let cache = LogNum.binomialCache.get(n);
    if (!cache) {
      cache = new Map();
      LogNum.binomialCache.set(n, cache);
      cache.set(k, result);
    }

    return result;
  }

  static fromZipf(zipf: number) {
    return new LogNum(zipfToLogProb(zipf));
  }

  toNum() {
    return Math.exp(this.data);
  }

  toLog() {
    return this.data;
  }

  exp() {
    return new LogNum(Math.exp(this.data));
  }

  log() {
    return LogNum.from(this.data);
  }

  pow(power: number) {
    return new LogNum(this.data * power);
  }

  mul(other: LogNum) {
    return new LogNum(this.data + other.data);
  }

  div(other: LogNum) {
    return new LogNum(this.data - other.data);
  }

  add(other: LogNum) {
    let [max, min] = [this.data, other.data];
    if (max < min) {
      [max, min] = [min, max];
    }
    return new LogNum(max + Math.log1p(Math.exp(min - max)));
  }

  absSub(other: LogNum) {
    let [max, min] = [this.data, other.data];
    if (max < min) {
      [max, min] = [min, max];
    }
    return new LogNum(max + log1mExp(min - max));
  }

  sub(other: LogNum) {
    if (this.lt(other)) {
      throw new Error("log underflow");
    }
    return this.absSub(other);
  }

  gt(other: LogNum) {
    return this.data > other.data;
  }

  lt(other: LogNum) {
    return this.data < other.data;
  }

  static sum(values: LogNum[]) {
    const max = Math.max(...values.map((x) => x.data));
    const expSum = values.reduce((acc, x) => acc + Math.exp(x.data - max), 0);
    return new LogNum(max + Math.log(expSum));
  }

  static prod(values: LogNum[]) {
    return new LogNum(values.reduce((acc, x) => acc + x.data, 0));
  }
}
