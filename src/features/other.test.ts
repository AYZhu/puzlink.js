import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { otherFeatures } from "./other.js";
import { makeFeatureGetter } from "./index.js";

describe("otherFeatures", () => {
  const featuresOf = makeFeatureGetter(otherFeatures(), Wordlist.from([]));

  test("other features", () => {
    expect(featuresOf("level")).toMatchInlineSnapshot(`
      {
        "alternates vowels and consonants": "index(level, 1, 3) = lEvEl",
        "is one deletion to a palindrome": "level delete v = leel",
        "is palindrome": "le|v|el",
      }
    `);
    expect(featuresOf("abca")).toMatchInlineSnapshot(`
      {
        "is a hill": "ab<c>a",
        "is one change to a palindrome": "ab|ca",
        "is one deletion to a palindrome": "abca delete b = aca",
      }
    `);
    expect(featuresOf("abda")).toMatchInlineSnapshot(`
      {
        "is a hill": "ab<d>a",
        "is one change to a palindrome": "ab|da",
        "is one deletion to a palindrome": "abda delete b = ada",
      }
    `);
    expect(featuresOf("enot")).toMatchInlineSnapshot(`
      {
        "alternates vowels and consonants": "index(enot, 0, 2) = EnOt",
        "is a hill": "eno<t>",
        "is a valley": ">e<not",
      }
    `);
    expect(featuresOf("abcca")).toMatchInlineSnapshot(`
      {
        "is a hill": "ab<cc>a",
        "is one change to a palindrome": "ab|c|ca",
        "is one deletion to a palindrome": "abcca delete b = acca",
      }
    `);
    expect(featuresOf("cbaab")).toMatchInlineSnapshot(`
      {
        "is a valley": "cb>aa<b",
        "is one deletion to a palindrome": "cbaab delete c = baab",
      }
    `);
  });
});
