import { describe, expect, test } from "vitest";
import { answerLengthLogProbs } from "../data/answerLengths.js";
import { Distribution } from "../lib/distribution.js";
import { LengthDistribution } from "../lib/lengthDistribution.js";
import { lengthLinker } from "./length.js";

describe("lengthLinker", () => {
  const link = (slugs: string[]) =>
    lengthLinker(new LengthDistribution(new Distribution(answerLengthLogProbs)))
      .eval(slugs)
      .map((l) => l.name);

  test("length links", () => {
    expect(link(["aa", "bb", "cc"])).toMatchInlineSnapshot(`
      [
        "all lengths equal",
        "all lengths are even",
        "all lengths are equal mod 3",
      ]
    `);
    expect(link(["a", "b", "cc", "dd"])).toMatchInlineSnapshot(`
      [
        "only two lengths",
      ]
    `);
    expect(link(["a", "bbbb", "fffffff"])).toMatchInlineSnapshot(`
      [
        "all lengths are equal mod 3",
      ]
    `);
    expect(link(["aa", "bbb", "cccc"])).toMatchInlineSnapshot(`
      [
        "lengths are consecutive",
      ]
    `);
  });
});
