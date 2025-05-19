import { logProbToZipf } from "cromulence";
import { describe, expect, test } from "vitest";
import { LogNum } from "./logNum.js";
import { Wordlist } from "./wordlist.js";

describe("Wordlist", () => {
  const words = new Wordlist({
    ant: logProbToZipf(LogNum.fromFraction(1, 4).toLog()),
    cat: logProbToZipf(LogNum.fromFraction(1, 2).toLog()),
    dog: logProbToZipf(LogNum.fromFraction(1, 4).toLog()),
  });

  test("reduce", () => {
    expect(words.reduce(0, (acc) => acc + 1)).toBe(3);
    expect(words.reduce(0, (acc, slug) => acc + (slug === "cat" ? 1 : 0))).toBe(
      1,
    );
  });

  test("logProb", () => {
    expect(words.logProb(() => true).toNum()).toBeCloseTo(1);
    expect(words.logProb((slug) => slug.includes("a")).toNum()).toBeCloseTo(
      3 / 4,
    );
  });

  test("isWord, isPhrase", () => {
    expect(words.isWord("cat")).toBe(true);
    expect(words.isWord("bat")).toBe(false);
    expect(words.isPhrase("ant cat dog")).toBe(true);
  });

  test("isAnagram, isTransadd, isTransdelete", () => {
    expect(words.isAnagram("god")).toBe("dog");
    expect(words.isAnagram("bat")).toBe(null);
    expect(words.isTransadd("trac")).toStrictEqual({
      other: "cat",
      letter: "r",
    });
    expect(words.isTransadd("drug")).toBe(null);
    expect(words.isTransdelete("go")).toStrictEqual({
      other: "dog",
      letter: "d",
    });
    expect(words.isTransdelete("aa")).toBe(null);
  });
});
