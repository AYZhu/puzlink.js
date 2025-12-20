import { describe, expect, test } from "vitest";
import { Wordlist } from "./lib/wordlist.js";
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
        "can append letter": "can append s to at to get a word (ats)",
        "can append s": "can append s to at to get a word (ats)",
        "can insert b": "can insert b in at to get a word (bat)",
        "can insert c": "can insert c in at to get a word (cat)",
        "can insert letter": "can insert b in at to get a word (bat)",
        "can insert s": "can insert s in at to get a word (ats)",
        "can prepend b": "can prepend b to at to get a word (bat)",
        "can prepend c": "can prepend c to at to get a word (cat)",
        "can prepend letter": "can prepend b to at to get a word (bat)",
        "can reverse": "can reverse at to get a word (ta)",
        "has transadd": "at has a transadd with b (bat)",
        "has transadd with b": "at has a transadd with b (bat)",
        "has transadd with c": "at has a transadd with c (cat)",
        "has transadd with s": "at has a transadd with s (ats)",
        "is anagram": "at has an anagram (ta)",
      }
    `);
    expect(featuresOf("bats")).toMatchInlineSnapshot(`
      {
        "can behead": "can behead bats to get a word (ats)",
        "can change letter": "can change to h in bats to get a word (bath)",
        "can change to h": "can change to h in bats to get a word (bath)",
        "can curtail": "can curtail bats to get a word (bat)",
        "can delete b": "can delete b in bats to get a word (ats)",
        "can delete letter": "can delete b in bats to get a word (ats)",
        "can delete s": "can delete s in bats to get a word (bat)",
        "has transdelete": "bats has a transdelete with b (ats)",
        "has transdelete with b": "bats has a transdelete with b (ats)",
        "has transdelete with s": "bats has a transdelete with s (bat)",
      }
    `);
  });
});
