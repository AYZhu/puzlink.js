import { LogNum } from "./logNum.js";

/** A map from items to log counts. */
export class LogCounter<T extends PropertyKey> {
  private readonly counts: ReadonlyMap<T, LogNum>;
  readonly total: LogNum;

  constructor(counts: ReadonlyMap<T, LogNum>, total: LogNum) {
    this.counts = counts;
    this.total = total;
  }

  static from(data: string): LogCounter<string>;
  static from<T extends PropertyKey>(data: readonly T[]): LogCounter<T>;
  static from(data: string | readonly PropertyKey[]) {
    const counts = new Map<PropertyKey, number>();

    for (const item of data) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }

    return new LogCounter(
      new Map(
        Array.from(counts).map(([item, count]) => [item, LogNum.from(count)]),
      ),
      LogNum.from(data.length),
    );
  }

  get(item: T) {
    return this.counts.get(item) ?? LogNum.from(0);
  }
}
