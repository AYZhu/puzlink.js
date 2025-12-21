import { describe, expect, test } from "vitest";
import { Distribution } from "./distribution.js";

describe("Distribution", () => {
  const dist = Distribution.from([2, 3, 3, 4]);

  test("moment", () => {
    expect(dist.moment(1).toNum()).toBeCloseTo(1);
    expect(dist.moment(2).toNum()).toBeCloseTo(3 / 8);
  });

  test("map", () => {
    const mapped = dist.map((n) => n % 2);
    expect(mapped.moment(1).toNum()).toBeCloseTo(1);
    // prob three numbers from the distribution are the same mod 2:
    expect(mapped.moment(3).toNum()).toBeCloseTo(1 / 4);
  });
});
