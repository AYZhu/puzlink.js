import type { Feature } from "../feature.js";
import { booleanFeature } from "../feature.js";
import { LETTERS } from "../lib/letterDistribution.js";
import { LogNum } from "../lib/logNum.js";
import type { Wordlist } from "../lib/wordlist.js";

function prepend(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can prepend ${letter}`,
    property: (word) => {
      const prepended = `${letter}${word}`;
      return wordlist.isWord(prepended)
        ? `can prepend ${letter} to ${word} to get a word (${prepended})`
        : null;
    },
    wordlist,
  });
}

function append(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can append ${letter}`,
    property: (word) => {
      const appended = `${word}${letter}`;
      return wordlist.isWord(appended)
        ? `can append ${letter} to ${word} to get a word (${appended})`
        : null;
    },
    wordlist,
  });
}

function insertWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can insert ${letter}`,
    property: (word) => {
      for (let i = 0; i <= word.length; i++) {
        const inserted = `${word.slice(0, i)}${letter}${word.slice(i)}`;
        if (wordlist.isWord(inserted)) {
          return `can insert ${letter} in ${word} to get a word (${inserted})`;
        }
      }
      return null;
    },
    wordlist,
  });
}

function behead(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can behead",
    property: (word) => {
      const beheaded = word.slice(1);
      return wordlist.isWord(beheaded)
        ? `can behead ${word} to get a word (${beheaded})`
        : null;
    },
    wordlist,
  });
}

function curtail(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can curtail",
    property: (word) => {
      const curtailed = word.slice(0, word.length - 1);
      return wordlist.isWord(curtailed)
        ? `can curtail ${word} to get a word (${curtailed})`
        : null;
    },
    wordlist,
  });
}

function deleteWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can delete ${letter}`,
    property: (word) => {
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) {
          continue;
        }
        const deleted = `${word.slice(0, i)}${word.slice(i + 1)}`;
        if (wordlist.isWord(deleted)) {
          return `can delete ${letter} in ${word} to get a word (${deleted})`;
        }
      }
      return null;
    },
    wordlist,
  });
}

function change(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can change to ${letter}`,
    property: (word) => {
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          continue;
        }
        const changed = `${word.slice(0, i)}${letter}${word.slice(i + 1)}`;
        if (wordlist.isWord(changed)) {
          return `can change to ${letter} in ${word} to get a word (${changed})`;
        }
      }
      return null;
    },
    wordlist,
  });
}

function reverse(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can reverse",
    property: (word) => {
      const reversed = word.split("").reverse().join("");
      return wordlist.isWord(reversed)
        ? `can reverse ${word} to get a word (${reversed})`
        : null;
    },
    wordlist,
  });
}

function anagram(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "is anagram",
    property: (word) => {
      const anagrammed = wordlist.isAnagram(word);
      return anagrammed ? `${word} has an anagram (${anagrammed})` : null;
    },
    wordlist,
  });
}

function transaddWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `has transadd with ${letter}`,
    property: (word) => {
      const transadded = wordlist.isAnagram(`${word}${letter}`, false);
      return transadded
        ? `${word} has a transadd with ${letter} (${transadded})`
        : null;
    },
    wordlist,
  });
}

function transdeleteWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `has transdelete with ${letter}`,
    property: (word) => {
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          const transdeleted = wordlist.isAnagram(
            `${word.slice(0, i)}${word.slice(i + 1)}`,
            false,
          );
          if (transdeleted) {
            return `${word} has a transdelete with ${letter} (${transdeleted})`;
          }
        }
      }
      return null;
    },
    wordlist,
  });
}

function withEveryLetter(
  name: string,
  feature: (wordlist: Wordlist, letter: string) => Feature,
  wordlist: Wordlist,
): Feature[] {
  const features = Array.from(LETTERS).map((letter) =>
    feature(wordlist, letter),
  );
  const combined: Feature = {
    name,
    logProb: LogNum.sum(features.map((f) => f.logProb)),
    property: (word) => {
      for (const feature of features) {
        const property = feature.property(word);
        if (property) {
          return property;
        }
      }
      return null;
    },
  };
  return [...features, combined];
}

/** Features for qhex-style wordplay. */
export function wordplayFeatures(wordlist: Wordlist): Feature[] {
  return [
    ...withEveryLetter("can prepend letter", prepend, wordlist),
    ...withEveryLetter("can append letter", append, wordlist),
    ...withEveryLetter("can insert letter", insertWith, wordlist),
    behead(wordlist),
    curtail(wordlist),
    ...withEveryLetter("can delete letter", deleteWith, wordlist),
    ...withEveryLetter("can change letter", change, wordlist),
    reverse(wordlist),
    anagram(wordlist),
    ...withEveryLetter("has transadd", transaddWith, wordlist),
    ...withEveryLetter("has transdelete", transdeleteWith, wordlist),
  ];
}
