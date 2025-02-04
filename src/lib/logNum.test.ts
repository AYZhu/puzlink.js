import { describe, expect, test } from "vitest";
import { LogNum } from "./logNum.js";

describe("LogNum", () => {
  test("fromFraction", () => {
    expect(LogNum.fromFraction(1, 2).toNum()).toBeCloseTo(0.5);
  });

  test("fromBinomial", () => {
    expect(LogNum.fromBinomial(4, 2).toNum()).toBeCloseTo(6);
  });

  test("exp, mul, div", () => {
    expect(
      LogNum.fromFraction(1, 2)
        .exp(2)
        .mul(LogNum.fromFraction(1, 2))
        .div(LogNum.fromFraction(1, 8))
        .toNum(),
    ).toBeCloseTo(1);
  });

  test("add", () => {
    expect(
      LogNum.fromFraction(1, 2).add(LogNum.fromFraction(1, 4)).toNum(),
    ).toBeCloseTo(3 / 4);
  });

  test("sum", () => {
    expect(
      LogNum.sum([
        LogNum.fromFraction(1, 2),
        LogNum.fromFraction(1, 3),
        LogNum.fromFraction(1, 6),
      ]).toNum(),
    ).toBeCloseTo(1);
  });
});
