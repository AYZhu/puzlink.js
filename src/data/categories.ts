import greekLetters from "./categories/greekLetters.js";
import solfege from "./categories/solfege.js";

export const categories: { name: string; items: string[] }[] = [
  { name: "greek letters", items: greekLetters },
  { name: "solfege", items: solfege },
];
