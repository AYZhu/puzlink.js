import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { makeFeatureGetter } from "./index.js";
import { substringFeatures } from "./substring.js";

describe("substringFeatures", () => {
  const featuresOf = makeFeatureGetter(substringFeatures(), Wordlist.from([]));

  test("containsOne", () => {
    expect(featuresOf("alfalpha")).toMatchInlineSnapshot(`
      {
        "ends with greek letters": "alfalpha ends with alpha",
        "has element symbols substring": "alfalpha contains al",
        "has greek letters substring": "alfalpha contains alpha",
        "has iso 2-letter country codes substring": "alfalpha contains al",
        "has nato alphabet substring": "alfalpha contains alfa",
        "has solfege substring": "alfalpha contains fa",
        "has us state abbreviations substring": "alfalpha contains al",
        "starts with element symbols": "alfalpha starts with al",
        "starts with iso 2-letter country codes": "alfalpha starts with al",
        "starts with nato alphabet": "alfalpha starts with alfa",
        "starts with us state abbreviations": "alfalpha starts with al",
      }
    `);

    expect(featuresOf("carpal")).toMatchInlineSnapshot(`
      {
        "can be broken into element symbols": "carpal = c ar p al",
        "ends with element symbols": "carpal ends with al",
        "ends with iso 2-letter country codes": "carpal ends with al",
        "ends with us state abbreviations": "carpal ends with al",
        "has element symbols substring": "carpal contains c",
        "has iso 2-letter country codes substring": "carpal contains ca",
        "has us state abbreviations substring": "carpal contains ca",
        "starts with element symbols": "carpal starts with c",
        "starts with iso 2-letter country codes": "carpal starts with ca",
        "starts with us state abbreviations": "carpal starts with ca",
      }
    `);
  });
});
