// features for letter sequences: things we can remark based on letters/bigrams/etc., that rely on their relative order within the word
//
// - has letters [A..Z] and [A..Z] at distance [0..2] away from each other, exactly [1..3] times
// - has exactly [0..10] { alphabetical, reverse alphabetical, sequential, reverse sequential } bigrams
// - has at least [1..10] { alphabetical, reverse alphabetical, sequential, reverse sequential } bigrams
// - has {exactly, at least} [2..5] {vowels, consonants} in a row
// - starts and end with same { letter, bigram, trigram }
// - is a hill word (alpha, then reverse alpha)
// - is a valley word (reverse alpha, then alpha)
// - alternates vowels and consonants
