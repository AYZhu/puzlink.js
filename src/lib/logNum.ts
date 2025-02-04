/**
 * A numerically-stable-ish log number. Operations represent operations on
 * the numbers, not the log numbers.
 */
export class LogNum {
  private data: number;

  /** Construct from the actual log number. */
  constructor(data: number) {
    this.data = data;
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

  toNum() {
    return Math.exp(this.data);
  }

  toLog() {
    return this.data;
  }

  exp(exponent: number) {
    return new LogNum(this.data * exponent);
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

  static sum(values: LogNum[]) {
    const max = Math.max(...values.map((x) => x.data));
    const expSum = values.reduce((acc, x) => acc + Math.exp(x.data - max), 0);
    return new LogNum(max + Math.log(expSum));
  }
}
