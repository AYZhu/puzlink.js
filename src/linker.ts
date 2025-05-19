import { LogNum } from "./lib/logNum.js";

/**
 * A Link is a relationship between a set of words, with how strong it is
 * quantified via logProb.
 */
type Link = Readonly<{
  logProb: LogNum;
  description: readonly string[];
}>;

export const defaultLink: Link = {
  logProb: LogNum.from(1),
  description: [],
};

/**
 * A Linker is a function that takes a list of words and returns a Link.
 */
export type Linker = Readonly<{
  name: string;
  eval: (words: string[], ordered?: boolean) => Link;
}>;

/**
 * Create a linker that's the logical OR of the given linkers. Assumes they're
 * independently distributed.
 */
export function anyOfLinkers(linkers: Linker[]): Linker {
  return {
    name: `any of ${linkers.map((l) => l.name).join(", ")}`,
    eval: (...args) => {
      const links = linkers.map((l) => l.eval(...args));

      return {
        logProb: LogNum.from(1).sub(
          LogNum.prod(links.map((l) => LogNum.from(1).sub(l.logProb))),
        ),
        description: links.flatMap((l) => l.description),
      };
    },
  };
}

/**
 * Create a linker that's the logical AND of the given linkers. Assumes they're
 * independently distributed.
 */
export function allOfLinkers(linkers: Linker[]): Linker {
  return {
    name: `all of ${linkers.map((l) => l.name).join(", ")}`,
    eval: (...args) => {
      const links = linkers.map((l) => l.eval(...args));

      return {
        logProb: LogNum.prod(links.map((l) => l.logProb)),
        description: links.flatMap((l) => l.description),
      };
    },
  };
}
