import { describe, expect, test } from "vitest";
import { LetterDistribution } from "./letterDistribution.js";
import { Wordlist } from "./wordlist.js";
import { slugify } from "cromulence";

describe("LetterDistribution", async () => {
  const dist = new LetterDistribution(await Wordlist.download());

  test("prob", () => {
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

    expect(dist.prob(english).toNum()).toBeCloseTo(1);
    expect(dist.prob("jjjjjqqqqqxxxxxzzzzz").toNum()).toBeCloseTo(0);
    expect(dist.prob("alphabet").toNum()).toMatchInlineSnapshot(`0.6879`);
  });
});
