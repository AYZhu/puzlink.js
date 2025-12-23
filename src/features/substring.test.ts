import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { makeFeatureGetter } from "./index.js";
import { substringFeatures } from "./substring.js";

describe("substringFeatures", () => {
  const featuresOf = makeFeatureGetter(substringFeatures(), Wordlist.from([]));

  test("containsOne", () => {
    expect(featuresOf("alfalpha")).toMatchInlineSnapshot(`
      {
        "has greek letters substring": "alfalpha contains alpha",
        "has solfege substring": "alfalpha contains fa",
      }
    `);
  });
});
