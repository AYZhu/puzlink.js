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
        "has 1 bigrams, each repeating 2 times": "salsas: sa",
        "has 1 bigrams, each repeating at least 2 times": "salsas: sa",
        "has 1 l": "saLsas",
        "has 1 letters, each repeating 2 times": "salsas: a",
        "has 1 letters, each repeating 3 times": "salsas: s",
        "has 1 letters, each repeating at least 3 times": "salsas: s",
        "has 1 unique vowels": "salsas vowels: a",
        "has 2 a": "sAlsAs",
        "has 2 letters, each repeating at least 2 times": "salsas: s, a",
        "has 2 unique consonants": "salsas consonants: ls",
        "has 3 s": "SalSaS",
        "has 3 unique letters": "salsas letters: als",
        "has at least 1 a": "sAlsAs",
        "has at least 1 l": "saLsas",
        "has at least 1 s": "SalSaS",
        "has at least 2 a": "sAlsAs",
        "has at least 2 s": "SalSaS",
        "has at least 3 s": "SalSaS",
        "has letter counts in arithmetic sequence": "salsas letter counts of l, a, s are 1, 2, 3",
        "has repeated consonants": "salsas: s",
        "has repeated vowels": "salsas: a",
      }
    `);
    expect(featuresOf("abba")).toMatchInlineSnapshot(`
      {
        "has 1 unique consonants": "abba consonants: b",
        "has 1 unique vowels": "abba vowels: a",
        "has 2 a": "AbbA",
        "has 2 b": "aBBa",
        "has 2 letters, each repeating 2 times": "abba: a, b",
        "has 2 letters, each repeating at least 2 times": "abba: a, b",
        "has 2 unique letters": "abba letters: ab",
        "has at least 1 a": "AbbA",
        "has at least 1 b": "aBBa",
        "has at least 2 a": "AbbA",
        "has at least 2 b": "aBBa",
        "has equal letter counts": "abba letter counts are all 2",
        "has repeated consonants": "abba: b",
        "has repeated vowels": "abba: a",
      }
    `);
    expect(featuresOf("dresser")).toMatchInlineSnapshot(`
      {
        "has 1 d": "Dresser",
        "has 1 unique vowels": "dresser vowels: e",
        "has 2 e": "drEssEr",
        "has 2 r": "dResseR",
        "has 2 s": "dreSSer",
        "has 3 letters, each repeating 2 times": "dresser: r, e, s",
        "has 3 letters, each repeating at least 2 times": "dresser: r, e, s",
        "has 3 unique consonants": "dresser consonants: drs",
        "has 4 unique letters": "dresser letters: ders",
        "has at least 1 d": "Dresser",
        "has at least 1 e": "drEssEr",
        "has at least 1 r": "dResseR",
        "has at least 1 s": "dreSSer",
        "has at least 2 e": "drEssEr",
        "has at least 2 r": "dResseR",
        "has at least 2 s": "dreSSer",
        "has one of two letter counts": "dresser letter counts are 1 (d) or 2 (ers)",
        "has repeated consonants": "dresser: r, s",
        "has repeated vowels": "dresser: e",
      }
    `);
  });
});
