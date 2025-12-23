// features for letter counts: things we can remark solely based on the histogram of letters/bigrams/etc.
//
// - has {exactly, at least} [1..5] of the letter [A..Z]
// - has [1..5] unique vowels
// - has [1..15] unique consonants
// - has [1..26] unique letters
// - has exactly [1..5] {letters, bigrams, trigrams}, each of which appears exactly [2..4] times
// - has at least [1..5] {letters, bigrams, trigrams}, each of which appears at least [2..4] times
// - contains a repeated {vowel, consonant}
// - is a "pyramid word" (letters have counts A, A + 1, A + 2, ...)
// - is a "block word" (each letter has the same count)
// - is *almost* a block word (each letter has the same count, except for 1)
