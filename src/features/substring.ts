import {
  categories,
  shortCategories,
  type Category,
} from "../data/categories.js";
import { mapProduct } from "../lib/util.js";
import type { Feature } from "./index.js";

// TODO(maybe): contains anagram, for long categories?
// TODO(maybe): contains multiple, for short categories?
// TODO(maybe): looking for long substrings that are words; we need a good heuristic for these, because we e.g. don't want to report that UNDERSCORE is a substring of UNDERSCORES, but we do want to report STRANGE is a substring of FOREST RANGER

function containsOne(category: Category): Feature {
  const regex = new RegExp(category.items.join("|"));
  return {
    name: `has ${category.name} substring`,
    property: (slug) => {
      const match = regex.exec(slug);
      if (!match) {
        return null;
      }
      return `${slug} contains ${match[0]}`;
    },
  };
}

function startsWithOne(category: Category): Feature {
  const regex = new RegExp(`^(${category.items.join("|")})`);
  return {
    name: `starts with ${category.name}`,
    property: (slug) => {
      const match = regex.exec(slug);
      if (!match) {
        return null;
      }
      return `${slug} starts with ${match[0]}`;
    },
  };
}

function endsWithOne(category: Category): Feature {
  const regex = new RegExp(`(${category.items.join("|")})$`);
  return {
    name: `ends with ${category.name}`,
    property: (slug) => {
      const match = regex.exec(slug);
      if (!match) {
        return null;
      }
      return `${slug} ends with ${match[0]}`;
    },
  };
}

function canBeBrokenInto(category: Category): Feature {
  const regex = new RegExp(`^(${category.items.join("|")})+$`);
  return {
    name: `can be broken into ${category.name}`,
    property: (slug) => {
      let match = regex.exec(slug);
      if (!match) {
        return null;
      }
      const parts = [];
      let remaining = slug;
      while (match !== null) {
        const suffix = match[1]!;
        parts.push(suffix);
        remaining = remaining.slice(0, -suffix.length);
        match = regex.exec(remaining);
      }
      return `${slug} = ${parts.reverse().join(" ")}`;
    },
  };
}

export function substringFeatures(): Feature[] {
  return [
    ...mapProduct(containsOne, categories),
    ...mapProduct(startsWithOne, categories),
    ...mapProduct(endsWithOne, categories),
    ...mapProduct(canBeBrokenInto, shortCategories),
  ];
}
