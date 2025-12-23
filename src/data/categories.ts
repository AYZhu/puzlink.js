const greekLetters = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "rho",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
];

const solfege = ["do", "re", "me", "fa", "so", "la", "ti", "si"];

export const categories: [name: string, items: string[]][] = [
  ["greek letters", greekLetters],
  ["solfege", solfege],
];
