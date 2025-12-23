// features for containing special substrings (or subsequences)
//
// - "long" categories: greek letters, days of week, months, numbers, body parts, nato/radio operator alphabet
//   - make sure to put the category consts in the data folder
//   - maybe prioritize if starting/ending?
//   - maybe anagram if long?
// - "short" categories: solfege, periodic table, us state abbreviations, country abbreviations
//   - word contains [1..5] of these
//   - word can be completely broken down into these
// - honestly just looking for long substrings is good, but we need a good heuristic for these, because we e.g. don't want to report that UNDERSCORE is a substring of UNDERSCORES, but we do want to report STRANGE is a substring of FOREST RANGER
