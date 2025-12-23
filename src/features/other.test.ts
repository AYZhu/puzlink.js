import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { otherFeatures } from "./other.js";
import { makeFeatureGetter } from "./index.js";

describe("otherFeatures", () => {
  const featuresOf = makeFeatureGetter(otherFeatures(), Wordlist.from([]));

  test("other features", () => {
    expect(featuresOf("level")).toMatchInlineSnapshot(`
      {
        "has e at index -2": "index(level, -2) = e",
        "has e at index -4": "index(level, -4) = e",
        "has e at index 2": "index(level, 2) = e",
        "has e at index 4": "index(level, 4) = e",
        "has l at index -1": "index(level, -1) = l",
        "has l at index -5": "index(level, -5) = l",
        "has l at index 1": "index(level, 1) = l",
        "has l at index 5": "index(level, 5) = l",
        "has v at index -3": "index(level, -3) = v",
        "has v at index 3": "index(level, 3) = v",
        "is almost palindrome": "level reversed = level",
        "is palindrome": "level reversed = level",
      }
    `);
    expect(featuresOf("abca")).toMatchInlineSnapshot(`
      {
        "has a at index -1": "index(abca, -1) = a",
        "has a at index -4": "index(abca, -4) = a",
        "has a at index 1": "index(abca, 1) = a",
        "has a at index 4": "index(abca, 4) = a",
        "has b at index -3": "index(abca, -3) = b",
        "has b at index 2": "index(abca, 2) = b",
        "has c at index -2": "index(abca, -2) = c",
        "has c at index 3": "index(abca, 3) = c",
        "is almost palindrome": "abca reversed = acba",
      }
    `);
    expect(featuresOf("abda")).toMatchInlineSnapshot(`
      {
        "has a at index -1": "index(abda, -1) = a",
        "has a at index -4": "index(abda, -4) = a",
        "has a at index 1": "index(abda, 1) = a",
        "has a at index 4": "index(abda, 4) = a",
        "has b at index -3": "index(abda, -3) = b",
        "has b at index 2": "index(abda, 2) = b",
        "has d at index -2": "index(abda, -2) = d",
        "has d at index 3": "index(abda, 3) = d",
        "is almost palindrome": "abda reversed = adba",
      }
    `);
    expect(featuresOf("stone")).toMatchInlineSnapshot(`
      {
        "has e at index -1": "index(stone, -1) = e",
        "has e at index 5": "index(stone, 5) = e",
        "has n at index -2": "index(stone, -2) = n",
        "has n at index 4": "index(stone, 4) = n",
        "has o at index -3": "index(stone, -3) = o",
        "has o at index 3": "index(stone, 3) = o",
        "has s at index -5": "index(stone, -5) = s",
        "has s at index 1": "index(stone, 1) = s",
        "has t at index -4": "index(stone, -4) = t",
        "has t at index 2": "index(stone, 2) = t",
      }
    `);
  });
});
