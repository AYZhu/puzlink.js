import { beforeAll, describe, expect, test } from "vitest";
import { Puzlink } from "./index.js";
import { Wordlist } from "./lib/wordlist.js";

describe.skip("integration tests", () => {
  let puzlink: Puzlink;

  beforeAll(async () => {
    const wordlist = await Wordlist.download();
    puzlink = new Puzlink(wordlist);
  });

  test("1-1=1", () => {
    expect(
      puzlink.bestLink(
        "STRIFE SEAMAN NIX ETCH POST QUEER-ART FOO TALKS REPAYS STU HUMF UNDERHID SIXTEENS BOWMEN".split(
          " ",
        ),
        true,
      )?.name,
    ).toBe("has transdelete 1 (14 / 14)");
  });
});
