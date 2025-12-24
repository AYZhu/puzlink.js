import type { EvalSuite } from "../runEvals.js";

export default {
  name: "Ennui and Endurance",
  source: "panda magazine jan 2017",
  cases: [
    {
      slugs: `
        car
        dale
        eta
        fees
        freeing
        mien
        organa
        pried
      `,
      expected: "can insert z",
    },
  ],
} satisfies EvalSuite;
