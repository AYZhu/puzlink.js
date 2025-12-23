import { describe, expect, test } from "vitest";
import { Wordlist } from "../lib/wordlist.js";
import { makeFeatureGetter } from "./index.js";
import { letterSequenceFeatures } from "./letterSequence.js";

describe("letterSequenceFeatures", () => {
  const featuresOf = makeFeatureGetter(
    letterSequenceFeatures(),
    Wordlist.from([]),
  );

  test("letter sequence features", () => {
    expect(featuresOf("lefellele")).toMatchInlineSnapshot(`
      {
        "has 1 reverse sequential bigrams": "index(lefellele, 2, 3) = leFEllele",
        "has 1 sequential bigrams": "index(lefellele, 1, 2) = lEFellele",
        "has 2 consonants in a row": "index(lefellele, 4, 5) = lefeLLele",
        "has 3 alphabetical bigrams": "index(lefellele, 1, 2, 3, 4, 6, ...) = lEFELlELe",
        "has 4 reverse alphabetical bigrams": "index(lefellele, 0, 1, 2, 3, 5, ...) = LEFElLELE",
        "has at least 1 alphabetical bigrams": "index(lefellele, 1, 2, 3, 4, 6, ...) = lEFELlELe",
        "has at least 1 reverse alphabetical bigrams": "index(lefellele, 0, 1, 2, 3, 5, ...) = LEFElLELE",
        "has at least 1 reverse sequential bigrams": "index(lefellele, 2, 3) = leFEllele",
        "has at least 1 sequential bigrams": "index(lefellele, 1, 2) = lEFellele",
        "has at least 2 alphabetical bigrams": "index(lefellele, 1, 2, 3, 4, 6, ...) = lEFELlELe",
        "has at least 2 consonants in a row": "index(lefellele, 4, 5) = lefeLLele",
        "has at least 2 reverse alphabetical bigrams": "index(lefellele, 0, 1, 2, 3, 5, ...) = LEFElLELE",
        "has at least 3 alphabetical bigrams": "index(lefellele, 1, 2, 3, 4, 6, ...) = lEFELlELe",
        "has at least 3 reverse alphabetical bigrams": "index(lefellele, 0, 1, 2, 3, 5, ...) = LEFElLELE",
        "has at least 4 reverse alphabetical bigrams": "index(lefellele, 0, 1, 2, 3, 5, ...) = LEFElLELE",
        "has e with 1 letters between, 2 times": "index(lefellele, 1, 3, 6, 8) = lEfEllElE",
        "has e with 2 letters between, 1 times": "index(lefellele, 3, 6) = lefEllEle",
        "has equal letters with 0 letters between, 1 times": "index(lefellele, 4, 5) = lefeLLele",
        "has equal letters with 1 letters between, 3 times": "index(lefellele, 1, 3, 5, 6, 7, ...) = lEfElLELE",
        "has equal letters with 2 letters between, 2 times": "index(lefellele, 3, 4, 6, 7) = lefELlELe",
        "has equal letters with 3 letters between, 1 times": "index(lefellele, 0, 4) = LefeLlele",
        "has l with 0 letters between, 1 times": "index(lefellele, 4, 5) = lefeLLele",
        "has l with 1 letters between, 1 times": "index(lefellele, 5, 7) = lefelLeLe",
        "has l with 2 letters between, 1 times": "index(lefellele, 4, 7) = lefeLleLe",
        "has l with 3 letters between, 1 times": "index(lefellele, 0, 4) = LefeLlele",
        "starts and ends with the same 2 letters": "index(lefellele, 0, 1, 7, 8) = LEfelleLE",
      }
    `);
    expect(featuresOf("bcdfgaeiou")).toMatchInlineSnapshot(`
      {
        "has 0 reverse sequential bigrams": "index(bcdfgaeiou, ) = bcdfgaeiou",
        "has 1 reverse alphabetical bigrams": "index(bcdfgaeiou, 4, 5) = bcdfGAeiou",
        "has 3 sequential bigrams": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has 5 consonants in a row": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has 5 vowels in a row": "index(bcdfgaeiou, 5..9) = bcdfgAEIOU",
        "has 8 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 1 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 1 reverse alphabetical bigrams": "index(bcdfgaeiou, 4, 5) = bcdfGAeiou",
        "has at least 1 sequential bigrams": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 2 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 2 consonants in a row": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 2 sequential bigrams": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 2 vowels in a row": "index(bcdfgaeiou, 5..9) = bcdfgAEIOU",
        "has at least 3 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 3 consonants in a row": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 3 sequential bigrams": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 3 vowels in a row": "index(bcdfgaeiou, 5..9) = bcdfgAEIOU",
        "has at least 4 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 4 consonants in a row": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 4 vowels in a row": "index(bcdfgaeiou, 5..9) = bcdfgAEIOU",
        "has at least 5 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 5 consonants in a row": "index(bcdfgaeiou, 0..4) = BCDFGaeiou",
        "has at least 5 vowels in a row": "index(bcdfgaeiou, 5..9) = bcdfgAEIOU",
        "has at least 6 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 7 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
        "has at least 8 alphabetical bigrams": "index(bcdfgaeiou, 0..9) = BCDFGAEIOU",
      }
    `);
  });
});
