import { LETTERS } from "../lib/letterDistribution.js";
import { mapProduct } from "../lib/util.js";
import type { Feature } from "./index.js";

function prependWith(letter: string): Feature {
  return {
    name: `can prepend ${letter}`,
    property: (slug, wordlist) => {
      const prepended = `${letter}${slug}`;
      return wordlist.isWord(prepended)
        ? `${letter} + ${slug} = ${prepended}`
        : null;
    },
  };
}

function prependAny(): Feature {
  return {
    name: "can prepend 1",
    property: (slug, wordlist) => {
      const prepended = wordlist.filterWords(
        Array.from(LETTERS).map((letter) => `${letter}${slug}`),
      );
      return prepended.length === 0
        ? null
        : `1 + ${slug} = ${prepended.join(", ")}`;
    },
  };
}

function appendWith(letter: string): Feature {
  return {
    name: `can append ${letter}`,
    property: (slug, wordlist) => {
      const appended = `${slug}${letter}`;
      return wordlist.isWord(appended)
        ? `${slug} + ${letter} = ${appended}`
        : null;
    },
  };
}

function appendAny(): Feature {
  return {
    name: "can append 1",
    property: (slug, wordlist) => {
      const appended = wordlist.filterWords(
        Array.from(LETTERS).map((letter) => `${slug}${letter}`),
      );
      return appended.length === 0
        ? null
        : `${slug} + 1 = ${appended.join(", ")}`;
    },
  };
}

function insertWith(letter: string): Feature {
  return {
    name: `can insert ${letter}`,
    property: (slug, wordlist) => {
      const allInserted = [];
      for (let i = 0; i <= slug.length; i++) {
        allInserted.push(`${slug.slice(0, i)}${letter}${slug.slice(i)}`);
      }
      const inserted = wordlist.filterWords(allInserted);
      return inserted.length === 0
        ? null
        : `${slug} insert ${letter} = ${inserted.join(", ")}`;
    },
  };
}

function insertAny(): Feature {
  return {
    name: "can insert 1",
    property: (slug, wordlist) => {
      const allInserted = [];
      for (let i = 0; i <= slug.length; i++) {
        for (const letter of LETTERS) {
          allInserted.push(`${slug.slice(0, i)}${letter}${slug.slice(i)}`);
        }
      }
      const inserted = wordlist.filterWords(allInserted);
      return inserted.length === 0
        ? null
        : `${slug} insert 1 = ${inserted.join(", ")}`;
    },
  };
}

function behead(): Feature {
  return {
    name: "can behead 1",
    property: (slug, wordlist) => {
      const beheaded = slug.slice(1);
      return wordlist.isWord(beheaded)
        ? `${slug} behead 1 = ${beheaded}`
        : null;
    },
  };
}

function curtail(): Feature {
  return {
    name: "can curtail 1",
    property: (slug, wordlist) => {
      const curtailed = slug.slice(0, slug.length - 1);
      return wordlist.isWord(curtailed)
        ? `${slug} curtail 1 = ${curtailed}`
        : null;
    },
  };
}

function deleteWith(letter: string): Feature {
  return {
    name: `can delete ${letter}`,
    property: (slug, wordlist) => {
      const allDeleted = [];
      for (let i = 0; i < slug.length; i++) {
        if (slug[i] === letter) {
          allDeleted.push(`${slug.slice(0, i)}${slug.slice(i + 1)}`);
        }
      }
      const deleted = wordlist.filterWords(allDeleted);
      return deleted.length === 0
        ? null
        : `${slug} delete ${letter} = ${deleted.join(", ")}`;
    },
  };
}

function deleteAny(): Feature {
  return {
    name: "can delete 1",
    property: (slug, wordlist) => {
      const allDeleted = [];
      for (let i = 0; i < slug.length; i++) {
        allDeleted.push(`${slug.slice(0, i)}${slug.slice(i + 1)}`);
      }
      const deleted = wordlist.filterWords(allDeleted);
      return deleted.length === 0
        ? null
        : `${slug} delete 1 = ${deleted.join(", ")}`;
    },
  };
}

function changeTo(letter: string): Feature {
  return {
    name: `can change to ${letter}`,
    property: (slug, wordlist) => {
      const allChanged = [];
      for (let i = 0; i < slug.length; i++) {
        if (slug[i] !== letter) {
          allChanged.push(`${slug.slice(0, i)}${letter}${slug.slice(i + 1)}`);
        }
      }
      const changed = wordlist.filterWords(allChanged);
      return changed.length === 0
        ? null
        : `${slug} change to ${letter} = ${changed.join(", ")}`;
    },
  };
}

function changeAny(): Feature {
  return {
    name: "can change 1",
    property: (slug, wordlist) => {
      const allChanged = [];
      for (let i = 0; i < slug.length; i++) {
        for (const letter of LETTERS) {
          if (slug[i] !== letter) {
            allChanged.push(`${slug.slice(0, i)}${letter}${slug.slice(i + 1)}`);
          }
        }
      }
      const changed = wordlist.filterWords(allChanged);
      return changed.length === 0
        ? null
        : `${slug} change 1 = ${changed.join(", ")}`;
    },
  };
}

function reverse(): Feature {
  return {
    name: "can reverse",
    property: (slug, wordlist) => {
      const reversed = slug.split("").reverse().join("");
      return wordlist.isWord(reversed)
        ? `${slug} reversed = ${reversed}`
        : null;
    },
  };
}

// TODO: shift wordplay, e.g. move first letter to last spot, move last letter to first spot
// TODO: exchange wordplay, e.g. swap first and last letters, swap two adjacent letters
// TODO(maybe): words formed from taking odd or even letters?
// TODO(maybe): words that are caesar shifts of another word?

function anagram(): Feature {
  return {
    name: "is anagram",
    property: (slug, wordlist) => {
      const anagrams = wordlist.anagrams(slug);
      return anagrams.length === 0
        ? null
        : `${slug} anagrammed = ${anagrams.join(", ")}`;
    },
  };
}

function transaddWith(letter: string): Feature {
  return {
    name: `has transadd ${letter}`,
    property: (slug, wordlist) => {
      const transadds = wordlist.anagrams(`${slug}${letter}`, {
        loose: true,
      });
      return transadds.length === 0
        ? null
        : `${slug} transadd ${letter} = ${transadds.join(", ")}`;
    },
  };
}

function transaddAny(): Feature {
  return {
    name: "has transadd 1",
    property: (slug, wordlist) => {
      const allTransadds = [];
      for (const letter of LETTERS) {
        for (const transadd of wordlist.anagrams(`${slug}${letter}`, {
          loose: true,
        })) {
          allTransadds.push(transadd);
        }
      }
      const transadds = wordlist.filterWords(allTransadds);
      return transadds.length === 0
        ? null
        : `${slug} transadd 1 = ${transadds.join(", ")}`;
    },
  };
}

function transdeleteWith(letter: string): Feature {
  return {
    name: `has transdelete ${letter}`,
    property: (slug, wordlist) => {
      if (!slug.includes(letter)) {
        return null;
      }
      const transdeletes = wordlist.anagrams(slug.replace(letter, ""), {
        loose: true,
      });
      return transdeletes.length === 0
        ? null
        : `${slug} transdelete ${letter} = ${transdeletes.join(", ")}`;
    },
  };
}

function transdeleteAny(): Feature {
  return {
    name: "has transdelete 1",
    property: (slug, wordlist) => {
      const allTransdeletes = [];
      for (const letter of new Set(slug)) {
        for (const transdelete of wordlist.anagrams(slug.replace(letter, ""), {
          loose: true,
        })) {
          allTransdeletes.push(transdelete);
        }
      }
      const transdeletes = wordlist.filterWords(allTransdeletes);
      return transdeletes.length === 0
        ? null
        : `${slug} transdelete 1 = ${transdeletes.join(", ")}`;
    },
  };
}

/**
 * Features for wordplay: slugs that form a word when applying some sort of
 * transformation.
 */
export function wordplayFeatures(): Feature[] {
  return [
    ...mapProduct(prependWith, LETTERS),
    prependAny(),
    ...mapProduct(appendWith, LETTERS),
    appendAny(),
    ...mapProduct(insertWith, LETTERS),
    insertAny(),
    behead(),
    curtail(),
    ...mapProduct(deleteWith, LETTERS),
    deleteAny(),
    ...mapProduct(changeTo, LETTERS),
    changeAny(),
    reverse(),
    anagram(),
    ...mapProduct(transaddWith, LETTERS),
    transaddAny(),
    ...mapProduct(transdeleteWith, LETTERS),
    transdeleteAny(),
  ];
}
