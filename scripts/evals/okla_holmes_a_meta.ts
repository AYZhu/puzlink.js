import type { EvalSuite } from "../runEvals.js";

export default {
  name: "Okla-Holmes-A! meta",
  source: "https://puzzles.mit.edu/2012/puzzles/okla_holmes_a/solution/",
  cases: [
    {
      slugs: `
        CARPAL
        THE SOUTH
        STERNO
        BYLINE
        SO CLOSE
        BUFFOON
        VESTIGE
      `,
      expected: "can be broken into element symbols",
    },
  ],
} satisfies EvalSuite;
