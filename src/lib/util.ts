/* eslint-disable @typescript-eslint/no-explicit-any */

/** Returns an array of numbers from start to end (inclusive). */
export function interval(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

type Product<A extends Iterable<any>[]> = A extends [infer First, ...infer Rest]
  ? First extends Iterable<infer F>
    ? Rest extends Iterable<any>[]
      ? [F, ...Product<Rest>]
      : never
    : never
  : [];

/** Cartesian product of iterables. */
function* product<const Args extends Iterable<any>[]>(
  ...args: Args
): Generator<Product<Args>> {
  if (args.length === 1) {
    for (const arg of args[0]!) {
      yield [arg] as Product<Args>;
    }
    return;
  }
  const [first, ...rest] = args;
  for (const a of first!) {
    for (const b of product(...rest)) {
      yield [a, ...b] as Product<Args>;
    }
  }
}

type IterMap<A extends any[]> = A extends [infer First, ...infer Rest]
  ? [Iterable<First>, ...IterMap<Rest>]
  : [];

/** Map a function to a product of iterators. */
export function* mapProduct<const Args extends any[], R>(
  fn: (...args: Args) => R,
  ...args: IterMap<Args>
): Generator<R> {
  for (const arg of product(...args)) {
    yield fn(...(arg as unknown as Args));
  }
}
