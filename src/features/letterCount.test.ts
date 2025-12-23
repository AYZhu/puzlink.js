import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { makeFeatureGetter } from "./index.js";
import { letterCountFeatures } from "./letterCount.js";

describe("letterCountFeatures", () => {
  const featuresOf = makeFeatureGetter(
    letterCountFeatures(),
    Wordlist.from([]),
  );

  test("letter count features", () => {
    expect(featuresOf("salsas")).toMatchInlineSnapshot(`
      {
        "has 1 l": "saLsas",
        "has 1 unique vowels": "salsas: a",
        "has 2 a": "sAlsAs",
        "has 2 unique consonants": "salsas: ls",
        "has 3 s": "SalSaS",
        "has 3 unique letters": "salsas: als",
        "has at least 1 a": "sAlsAs",
        "has at least 1 l": "saLsas",
        "has at least 1 s": "SalSaS",
        "has at least 2 a": "sAlsAs",
        "has at least 2 s": "SalSaS",
        "has at least 3 s": "SalSaS",
      }
    `);
  });
});
