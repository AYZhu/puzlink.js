import { describe, expect, test } from "vitest";
import { LetterCounter } from "./letterCounter.js";

describe("LetterCounter", () => {
  test("index works", () => {
    const mask = LetterCounter.from("abacabadabacaba");

    expect(mask.index("a")).toBe(8);
    expect(mask.index("b")).toBe(4);
    expect(mask.index("c")).toBe(2);
    expect(mask.index("d")).toBe(1);
    expect(mask.index("e")).toBe(0);
  });

  test("add and sub work", () => {
    const mask = LetterCounter.from("abba");

    mask.add("a");
    expect(mask.index("a")).toBe(3);
    expect(mask.index("b")).toBe(2);

    mask.sub("b");
    expect(mask.index("a")).toBe(3);
    expect(mask.index("b")).toBe(1);
  });

  test("equals works", () => {
    expect(LetterCounter.from("abba").equals(LetterCounter.from("baba"))).toBe(
      true,
    );
    expect(LetterCounter.from("aba").equals(LetterCounter.from("baba"))).toBe(
      false,
    );
  });

  test("transadd and transdelete work", () => {
    expect(
      LetterCounter.from("bamba").transaddOf(LetterCounter.from("abba")),
    ).toBe("m");
    expect(
      LetterCounter.from("abba").transdeleteOf(LetterCounter.from("bamba")),
    ).toBe("m");

    expect(
      LetterCounter.from("abba").transaddOf(LetterCounter.from("mamba")),
    ).toBe(null);
    expect(
      LetterCounter.from("abba").transaddOf(LetterCounter.from("abba")),
    ).toBe(null);
    expect(
      LetterCounter.from("mamba").transaddOf(LetterCounter.from("abba")),
    ).toBe(null);
  });
});
