import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { otherFeatures } from "./other.js";
import { makeFeatureGetter } from "./index.js";

describe("otherFeatures", () => {
  const featuresOf = makeFeatureGetter(
    otherFeatures(),
    Wordlist.from(["level", "lever", "abca", "abda", "noon", "stone"]),
  );

  test("palindromes features", () => {
    expect(featuresOf("level")).toMatchInlineSnapshot(`
      {
        "has e at index -2": "level has e at index -2",
        "has e at index -4": "level has e at index -4",
        "has e at index 2": "level has e at index 2",
        "has e at index 4": "level has e at index 4",
        "has l at index -1": "level has l at index -1",
        "has l at index -5": "level has l at index -5",
        "has l at index 1": "level has l at index 1",
        "has l at index 5": "level has l at index 5",
        "has v at index -3": "level has v at index -3",
        "has v at index 3": "level has v at index 3",
        "is almost palindrome": "level is a palindrome",
        "is palindrome": "level is a palindrome",
      }
    `);
    expect(featuresOf("abca")).toMatchInlineSnapshot(`
      {
        "has a at index -1": "abca has a at index -1",
        "has a at index -4": "abca has a at index -4",
        "has a at index 1": "abca has a at index 1",
        "has a at index 4": "abca has a at index 4",
        "has b at index -3": "abca has b at index -3",
        "has b at index 2": "abca has b at index 2",
        "has c at index -2": "abca has c at index -2",
        "has c at index 3": "abca has c at index 3",
        "is almost palindrome": "abca is almost a palindrome",
      }
    `);
    expect(featuresOf("abda")).toMatchInlineSnapshot(`
      {
        "has a at index -1": "abda has a at index -1",
        "has a at index -4": "abda has a at index -4",
        "has a at index 1": "abda has a at index 1",
        "has a at index 4": "abda has a at index 4",
        "has b at index -3": "abda has b at index -3",
        "has b at index 2": "abda has b at index 2",
        "has d at index -2": "abda has d at index -2",
        "has d at index 3": "abda has d at index 3",
        "is almost palindrome": "abda is almost a palindrome",
      }
    `);
    expect(featuresOf("stone")).toMatchInlineSnapshot(`
      {
        "has e at index -1": "stone has e at index -1",
        "has e at index 5": "stone has e at index 5",
        "has n at index -2": "stone has n at index -2",
        "has n at index 4": "stone has n at index 4",
        "has o at index -3": "stone has o at index -3",
        "has o at index 3": "stone has o at index 3",
        "has s at index -5": "stone has s at index -5",
        "has s at index 1": "stone has s at index 1",
        "has t at index -4": "stone has t at index -4",
        "has t at index 2": "stone has t at index 2",
      }
    `);
  });
});
