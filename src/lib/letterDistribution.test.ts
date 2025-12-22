import { describe, expect, test } from "vitest";
import { LetterDistribution } from "./letterDistribution.js";
import { slugify } from "cromulence";
import { Distribution } from "./distribution.js";

describe("LetterDistribution", () => {
  const english = slugify(`
    AAAAAAAA
    BB
    CCC
    DDDD
    EEEEEEEEEEEEE
    FF
    GG
    HHHHHH
    IIIIIII
    .
    K
    LLLL
    MM
    NNNNNNN
    OOOOOOOO
    PP
    .
    RRRRRR
    SSSSSS
    TTTTTTTTT
    UUU
    V
    WW
    .
    YY
    .
  `);
  const dist = new LetterDistribution(Distribution.from(english));

  test("prob", () => {
    expect(dist.prob(english).toNum()).toBeCloseTo(1);
    expect(dist.prob("jjjjjqqqqqxxxxxzzzzz").toNum()).toBeCloseTo(0);
    expect(dist.prob("alphabet").toNum()).toMatchInlineSnapshot(
      `0.6628000000000001`,
    );
  });
});
