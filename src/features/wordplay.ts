import type { Feature } from "../feature.js";
import { booleanFeature } from "../feature.js";
import { LETTERS } from "../lib/letterDistribution.js";
import { mapProduct } from "../lib/util.js";
import type { Wordlist } from "../lib/wordlist.js";

function prependWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can prepend ${letter}`,
    property: (word) => {
      const prepended = `${letter}${word}`;
      return wordlist.isWord(prepended)
        ? `${letter} + ${word} = ${prepended}`
        : null;
    },
    wordlist,
  });
}

function prependAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can prepend 1",
    property: (word) => {
      const prepended = wordlist.filterWords(
        Array.from(LETTERS).map((letter) => `${letter}${word}`),
      );
      return prepended.length === 0
        ? null
        : `1 + ${word} = ${prepended.join(", ")}`;
    },
    wordlist,
  });
}

function appendWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can append ${letter}`,
    property: (word) => {
      const appended = `${word}${letter}`;
      return wordlist.isWord(appended)
        ? `${word} + ${letter} = ${appended}`
        : null;
    },
    wordlist,
  });
}

function appendAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can append 1",
    property: (word) => {
      const appended = wordlist.filterWords(
        Array.from(LETTERS).map((letter) => `${word}${letter}`),
      );
      return appended.length === 0
        ? null
        : `${word} + 1 = ${appended.join(", ")}`;
    },
    wordlist,
  });
}

function insertWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can insert ${letter}`,
    property: (word) => {
      const allInserted = [];
      for (let i = 0; i <= word.length; i++) {
        allInserted.push(`${word.slice(0, i)}${letter}${word.slice(i)}`);
      }
      const inserted = wordlist.filterWords(allInserted);
      return inserted.length === 0
        ? null
        : `${word} insert ${letter} = ${inserted.join(", ")}`;
    },
    wordlist,
  });
}

function insertAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can insert 1",
    property: (word) => {
      const allInserted = [];
      for (let i = 0; i <= word.length; i++) {
        for (const letter of LETTERS) {
          allInserted.push(`${word.slice(0, i)}${letter}${word.slice(i)}`);
        }
      }
      const inserted = wordlist.filterWords(allInserted);
      return inserted.length === 0
        ? null
        : `${word} insert 1 = ${inserted.join(", ")}`;
    },
    wordlist,
  });
}

function behead(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can behead 1",
    property: (word) => {
      const beheaded = word.slice(1);
      return wordlist.isWord(beheaded)
        ? `${word} behead 1 = ${beheaded}`
        : null;
    },
    wordlist,
  });
}

function curtail(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can curtail 1",
    property: (word) => {
      const curtailed = word.slice(0, word.length - 1);
      return wordlist.isWord(curtailed)
        ? `${word} curtail 1 = ${curtailed}`
        : null;
    },
    wordlist,
  });
}

function deleteWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can delete ${letter}`,
    property: (word) => {
      const allDeleted = [];
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          allDeleted.push(`${word.slice(0, i)}${word.slice(i + 1)}`);
        }
      }
      const deleted = wordlist.filterWords(allDeleted);
      return deleted.length === 0
        ? null
        : `${word} delete ${letter} = ${deleted.join(", ")}`;
    },
    wordlist,
  });
}

function deleteAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can delete 1",
    property: (word) => {
      const allDeleted = [];
      for (let i = 0; i < word.length; i++) {
        allDeleted.push(`${word.slice(0, i)}${word.slice(i + 1)}`);
      }
      const deleted = wordlist.filterWords(allDeleted);
      return deleted.length === 0
        ? null
        : `${word} delete 1 = ${deleted.join(", ")}`;
    },
    wordlist,
  });
}

function changeTo(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `can change to ${letter}`,
    property: (word) => {
      const allChanged = [];
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) {
          allChanged.push(`${word.slice(0, i)}${letter}${word.slice(i + 1)}`);
        }
      }
      const changed = wordlist.filterWords(allChanged);
      return changed.length === 0
        ? null
        : `${word} change to ${letter} = ${changed.join(", ")}`;
    },
    wordlist,
  });
}

function changeAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "can change 1",
    property: (word) => {
      const allChanged = [];
      for (let i = 0; i < word.length; i++) {
        for (const letter of LETTERS) {
          if (word[i] !== letter) {
            allChanged.push(`${word.slice(0, i)}${letter}${word.slice(i + 1)}`);
          }
        }
      }
      const changed = wordlist.filterWords(allChanged);
      return changed.length === 0
        ? null
        : `${word} change 1 = ${changed.join(", ")}`;
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
        ? `${word} reversed = ${reversed}`
        : null;
    },
    wordlist,
  });
}

// TODO: shift wordplay, e.g. move first letter to last spot, move last letter to first spot
// TODO: exchange wordplay, e.g. swap first and last letters, swap two adjacent letters
// TODO(maybe): words formed from taking odd or even letters?
// TODO(maybe): words that are caesar shifts of another word?

function anagram(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "is anagram",
    property: (word) => {
      const anagrams = wordlist.anagrams(word);
      return anagrams.length === 0
        ? null
        : `${word} anagrammed = ${anagrams.join(", ")}`;
    },
    wordlist,
  });
}

function transaddWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `has transadd ${letter}`,
    property: (word) => {
      const transadds = wordlist.anagrams(`${word}${letter}`, {
        strict: false,
      });
      return transadds.length === 0
        ? null
        : `${word} transadd ${letter} = ${transadds.join(", ")}`;
    },
    wordlist,
  });
}

function transaddAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "has transadd 1",
    property: (word) => {
      const allTransadds = [];
      for (const letter of LETTERS) {
        for (const transadd of wordlist.anagrams(`${word}${letter}`, {
          strict: false,
        })) {
          allTransadds.push(transadd);
        }
      }
      const transadds = wordlist.filterWords(allTransadds);
      return transadds.length === 0
        ? null
        : `${word} transadd 1 = ${transadds.join(", ")}`;
    },
    wordlist,
  });
}

function transdeleteWith(wordlist: Wordlist, letter: string): Feature {
  return booleanFeature({
    name: `has transdelete ${letter}`,
    property: (word) => {
      if (!word.includes(letter)) {
        return null;
      }
      const transdeletes = wordlist.anagrams(word.replace(letter, ""), {
        strict: false,
      });
      return transdeletes.length === 0
        ? null
        : `${word} transdelete ${letter} = ${transdeletes.join(", ")}`;
    },
    wordlist,
  });
}

function transdeleteAny(wordlist: Wordlist): Feature {
  return booleanFeature({
    name: "has transdelete 1",
    property: (word) => {
      const allTransdeletes = [];
      for (const letter of new Set(word)) {
        for (const transdelete of wordlist.anagrams(word.replace(letter, ""), {
          strict: false,
        })) {
          allTransdeletes.push(transdelete);
        }
      }
      const transdeletes = wordlist.filterWords(allTransdeletes);
      return transdeletes.length === 0
        ? null
        : `${word} transdelete 1 = ${transdeletes.join(", ")}`;
    },
    wordlist,
  });
}

/**
 * Features for wordplay: words that form another word when applying some sort
 * of transformation.
 */
export function wordplayFeatures(wordlist: Wordlist): Feature[] {
  return [
    ...mapProduct(prependWith, [wordlist], LETTERS),
    prependAny(wordlist),
    ...mapProduct(appendWith, [wordlist], LETTERS),
    appendAny(wordlist),
    ...mapProduct(insertWith, [wordlist], LETTERS),
    insertAny(wordlist),
    behead(wordlist),
    curtail(wordlist),
    ...mapProduct(deleteWith, [wordlist], LETTERS),
    deleteAny(wordlist),
    ...mapProduct(changeTo, [wordlist], LETTERS),
    changeAny(wordlist),
    reverse(wordlist),
    anagram(wordlist),
    ...mapProduct(transaddWith, [wordlist], LETTERS),
    transaddAny(wordlist),
    ...mapProduct(transdeleteWith, [wordlist], LETTERS),
    transdeleteAny(wordlist),
  ];
}
