import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { wordplayFeatures } from "./wordplay.js";

describe("wordplayFeatures", () => {
  const features = wordplayFeatures(
    Wordlist.from(["at", "ats", "bar", "bat", "bath", "cat", "ta"]),
  );

  const featuresOf = (word: string) => {
    return Object.fromEntries(
      features.flatMap((feature) => {
        const property = feature.property(word);
        return property ? [[feature.name, property]] : [];
      }),
    );
  };

  test("wordplay features", () => {
    expect(featuresOf("at")).toMatchInlineSnapshot(`
      {
        "can append 1": "at + 1 = ats",
        "can append s": "at + s = ats",
        "can insert 1": "at insert 1 = bat, cat, ats",
        "can insert b": "at insert b = bat",
        "can insert c": "at insert c = cat",
        "can insert s": "at insert s = ats",
        "can prepend 1": "1 + at = bat, cat",
        "can prepend b": "b + at = bat",
        "can prepend c": "c + at = cat",
        "can reverse": "at reversed = ta",
        "has transadd 1": "at transadd 1 = bat, cat, ats",
        "has transadd b": "at transadd b = bat",
        "has transadd c": "at transadd c = cat",
        "has transadd s": "at transadd s = ats",
        "is anagram": "at anagrammed = ta",
      }
    `);
    expect(featuresOf("bats")).toMatchInlineSnapshot(`
      {
        "can behead 1": "bats behead 1 = ats",
        "can change 1": "bats change 1 = bath",
        "can change to h": "bats change to h = bath",
        "can curtail 1": "bats curtail 1 = bat",
        "can delete 1": "bats delete 1 = ats, bat",
        "can delete b": "bats delete b = ats",
        "can delete s": "bats delete s = bat",
        "has transdelete 1": "bats transdelete 1 = ats, bat",
        "has transdelete b": "bats transdelete b = ats",
        "has transdelete s": "bats transdelete s = bat",
      }
    `);
  });
});
