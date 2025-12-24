import { beforeAll, describe, expect, test } from "vitest";
import { Puzlink } from "./index.js";
import { Wordlist } from "./lib/wordlist.js";

// TODO: we should have some sort of script for running integration tests,
// they take a few seconds to run, even when warm

// These tests are stolen from Collective.jl:
// https://github.com/rdeits/Collective.jl
describe("link", () => {
  let puzlink: Puzlink;
  const link = (words: string | string[]) => {
    const links = puzlink.link(words, true);
    return links[0]!.name;
  };

  beforeAll(async () => {
    const wordlist = await Wordlist.download();
    puzlink = new Puzlink(wordlist);
  });

  // https://puzzles.mit.edu/2016/puzzle/1_2_3/solution/
  test("1, 2, 3", () => {
    expect(
      link(`
        season
        save up
        ECOWAS
        ignore
        sluice
        Hosni
        in bed
        Barbeau
        museum
        Tobiah
        unsew
        Dolce
        anaphia
        teenage
      `),
    ).toBe("has 3 unique consonants (11 / 14)");
  });

  // https://puzzles.mit.edu/2007/puzzles/1_1_1/
  // TODO: currently has the wrong best feature
  test.skip("1 - 1 = 1", () => {
    expect(
      link(
        `STRIFE SEAMAN NIX ETCH POST QUEER-ART FOO TALKS REPAYS STU HUMF UNDERHID SIXTEENS BOWMEN`,
      ),
    ).toBe("has transdelete 1 (14 / 14)");
  });

  // https://puzzles.mit.edu/2012/puzzles/william_s_bergman/behave/solution/
  test("Behave", () => {
    expect(
      link(
        `ANNIE PROULX, COMMUTATIVE, HUGO WEAVING, MOUNTAIN DEW, MOZAMBIQUE, SEQUOIA`,
      ),
    ).toBe("has 5 unique vowels (6 / 6)");

    // TODO: implement
    // expect(
    //   link(
    //     `ANNOTATION, ARTIFICIAL, ENGINE ROOM, INDIVIDUAL, OMNIVOROUS, ON LOCATION`,
    //   ),
    // ).toBe("has same vowel/consonant pattern");

    expect(link(`ALMOST, BIOPSY, CHIMP, FILMS, GHOST, TUX`)).toBe(
      "has at least 1 reverse alphabetical bigrams (0 / 6)",
    );

    expect(link(`BALKED, BAR SPOON, HIGH NOON, KLUTZY, ONYX, POSTED`)).toBe(
      "has at least 2 reverse sequential bigrams (5 / 6)",
    );
  });

  // https://puzzles.mit.edu/2013/coinheist.com/rubik/clockwork_orange/answer/index.html
  test("Clockwork Oran.ge", () => {
    expect(
      link(`
        ARMORED RECON
        HYPAPANTE
        COMMEMORATIVE BATS
        DERRICK TRUCK
        BROWN ROT
        ATTORNEYS GENERAL
        SACROSANCT
        IMPROMPTU
      `),
    ).toBe("has 1 bigrams, each repeating 2 times (8 / 8)");
  });

  // panda magazine jan 2017
  test("Ennui and Endurance", () => {
    expect(
      link(`
        car
        dale
        eta
        fees
        freeing
        mien
        organa
        pried
      `),
    ).toBe("can insert z (6 / 8)");
  });

  // https://puzzles.mit.edu/2013/coinheist.com/get_smart/following_the_news/answer/index.html
  // TODO: implement; this should be "preponderance of ENSW"
  test.skip("Following the News", () => {
    expect(
      link(`
        ANDREW LIN
        BETA TESTS
        CLOCK OF THE LONG NOW
        DECOMPRESSOR
        EUGENE
        FUNGUS-PROOF SWORD
        GLEEMEN
        HANSARDISE
        INTERPOSE
      `),
    ).toBe("has unusual letter distribution");
  });

  // http://www.maths.usyd.edu.au/ub/sums/puzzlehunt/2016/puzzles/A2S1_Last_Resort.pdf
  test("Last Resort", () => {
    expect(
      link(
        `"advent", "achilles", "binary", "norway", "bubbly", "yacht", "anchor"`,
      ),
    ).toBe("has 1 reverse alphabetical bigrams (7 / 7)");
  });

  // https://puzzles.mit.edu/2012/puzzles/okla_holmes_a/solution/
  test("Okla-Holmes-A! meta", () => {
    expect(
      link(`
        CARPAL
        THE SOUTH
        STERNO
        BYLINE
        SO CLOSE
        BUFFOON
        VESTIGE
      `),
    ).toBe("can be broken into element symbols (7 / 7)");
  });

  // https://puzzles.mit.edu/2015/puzzle/pod_of_dolphins_meta/solution/
  // TODO: points to the wrong best feature
  test.skip("Pod of Dolphins meta", () => {
    expect(
      link(`
        CITYGATES
        IMPULSIVE
        CLICKSPAM
        BAPTISTRY
        LEVIATHAN
        POLICECAR
        COUPDETAT
        SFORZANDO
        CARTWHEEL
      `),
    ).toBe("has 1 letter each repeated 2 times");
  });

  // https://puzzles.mit.edu/2012/puzzles/watson_2_0/r_e_s_p_e_c_t/solution/
  // TODO: points to the wrong best feature
  test.skip("R.E.S.P.E.C.T.", () => {
    expect(
      link(`
        ABMNOT
        AENORTY
        BCEKLORSTU
        BFLU
        CDEILNOTU
        CIK
        GIOPS
      `),
    ).toBe("has transadd 1 (7 / 7)");
  });

  // http://tinyurl.com/nplbarexam Main-D-EggPlant.pdf
  // TODO: implement
  test.skip("The Egg Plant", () => {
    // TODO: points to the wrong best feature
    expect(
      link(
        `"cardioid", "liqueur", "naiads", "paleoecology", "tenuous", "breathtaking", "hangnail", "topspin", "wardrobe", "worldly"`,
      ),
    ).toBe("has two equal letters at distance 1");

    expect(
      link(`"despumate", "motorcade", "overboard", "shared", "simoleon"`),
    ).toBe("has an animal substring");

    expect(
      link(`"beggar", "deliver", "fiendish", "multiple", "swordsman"`),
    ).toBe("has an animal subsequence");

    expect(
      link(`"brazen", "coatimundi", "hatred", "socket", "vestibule"`),
    ).toBe("has a clothing substring");

    expect(link(`"edens", "emanate", "gratin", "rancho", "select"`)).toBe(
      "is a word when first letter shifted",
    );

    expect(link(`"earth", "ingles", "ought", "raked", "those"`)).toBe(
      "is a word when last letter shifted",
    );
  });

  // https://puzzles.mit.edu/2014/puzzle-solution/venntersections/
  test("Venntersections", () => {
    expect(
      link(
        `"lowered", "levitate", "inanimate", "paradise", "leveraged", "sizes", "tuxedo"`,
      ),
    ).toBe("alternates vowels and consonants (7 / 7)");

    // TODO: implement
    // expect(
    //   link(
    //     `"leveraged", "sizes", "tuxedo", "lynx", "lightly", "crocodile", "triumph"`,
    //   ),
    // ).toBe("has scrabble score 14");

    // TODO: implement
    // expect(
    //   link(
    //     `"lowered", "levitate", "leveraged", "lynx", "lightly", "lengths", "legislator"`,
    //   ),
    // ).toBe("has l at index 0");

    expect(
      link(
        `"levitate", "inanimate", "sizes", "lightly", "crocodile", "legislator", "carousels"`,
      ),
    ).toBe("has repeated consonants (7 / 7)");

    expect(
      link(
        `"questionable", "businesswoman", "exhaustion", "discouraged", "communicated", "hallucinogen", "sequoia"`,
      ),
    ).toBe("has 5 unique vowels (7 / 7)");

    // TODO: implement
    // expect(
    //   link(
    //     `"grimaced", "formally", "questionable", "discouraged", "communicated", "chrysalis", "saccharin"`,
    //   ),
    // ).toBe("has a at index -4");

    // TODO: points to the wrong best feature
    // expect(
    //   link(
    //     `"formally", "thinnest", "businesswoman", "communicated", "hallucinogen", "saccharin", "cellophane"`,
    //   ),
    // ).toBe("has a double letter");

    expect(
      link(
        `"thumbtacks", "monologue", "frigidities", "statuesque", "testimony", "satirizing", "flawed"`,
      ),
    ).toBe("has days of the week substring (7 / 7)");

    expect(
      link(
        `"thumbtacks", "monologue", "testimony", "camel", "meteorology", "trampoline", "achievement"`,
      ),
    ).toBe("has 1 m (7 / 7)");

    expect(
      link(
        `"monologue", "frigidities", "satirizing", "meteorology", "avalance", "achievement", "constitute"`,
      ),
    ).toBe("has 1 letters, each repeating at least 3 times (7 / 7)");

    expect(
      link(
        `"philharmonic", "mischievous", "alphabet", "restaurant", "leeching", "mushroom", "pioneer"`,
      ),
    ).toBe("has greek letters substring (7 / 7)");

    // TODO: points to the wrong best feature
    // expect(
    //   link(
    //     `"leeching", "mushroom", "pioneer", "loophole", "toothpaste", "seventeenth", "kneeling"`,
    //   ),
    // ).toBe("has equal letters with 0 letters between, 1 times (7 / 7)");

    // TODO: implement
    // expect(
    //   link(
    //     `"philharmonic", "mischievous", "leeching", "loophole", "toothpaste", "alcoholic", "narwhal"`,
    //   ),
    // ).toBe("has h at index 5");

    // TODO: points to the wrong best feature
    // expect(
    //   link(
    //     `"mischievous", "alphabet", "mushroom", "toothpaste", "seventeenth", "narwhal", "chromosome"`,
    //   ),
    // ).toBe("has 3 consonants in a row");
  });

  // https://puzzles.mit.edu/2011/puzzles/civilization/meta/wall_street.html
  test("Wall Street", () => {
    expect(
      link(`
        aUtUmn
        badmiNtoN
        traFFicpylon
        AmericAn
        IngrId
        meRcuRy
        CornCake
        gOOier
        trIskelIon
        waNderiNg
      `),
    ).toBe("has 1 letters, each repeating at least 2 times (10 / 10)");
  });

  // https://puzzles.mit.edu/2013/coinheist.com/get_smart/wordplay/answer/index.html
  test("Wordplay", () => {
    expect(link(`"ample", "adenoid", "music", "fifa"`)).toBe(
      "is a hill (4 / 4)",
    );

    expect(
      link(`"peeped", "isseis", "fee", "acacia", "salsas", "arrear"`),
    ).toBe("has letter counts in arithmetic sequence (6 / 6)");

    expect(
      link(`"skort", "sporty", "yolks", "peccadillo", "unknot", "rosy"`),
    ).toBe("is a valley (6 / 6)");

    expect(link(`"testset", "lol", "tenet", "malayalam"`)).toBe(
      "is palindrome (4 / 4)",
    );

    // TODO: points to the wrong best feature
    // expect(
    //   link(
    //     `"hitchhiker", "kaashoek", "jellystone", "kierkegaard", "metallica", "maastrict", "menschheit"`,
    //   ),
    // ).toBe("has equal letters with 0 letters between, 1 times (7 / 7)");

    expect(link(`"aime", "eye", "eerie", "riaa", "oahu", "oeis"`)).toBe(
      "has 1 unique consonants (6 / 6)",
    );
  });

  // https://puzzles.mit.edu/2013/coinheist.com/rubik/yellow_flag/answer/index.html
  // TODO: implement
  test.skip("Yellow Flag", () => {
    expect(
      link(`
        DEDITION
        EXTANT
        SHLEP
        SLAUGHTER
        ARMORED RECON
        HYPAPANTE
        COMMEMORATIVE BATS
        BEER CHUGGING
      `),
    ).toBe("each index has one repeated letter");
  });
});
