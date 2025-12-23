// - letters at index [-10..10] are:
//   - all the same, or almost all the same
//   - (ordered) spell a word
//   - are an anagram of a word
//   - one of two choices
//   - (ordered) are consecutive
//   - can pair up
// - (ordered) letters on the diagonal are (as above)

// TODO: this should be here, actually, and not in features
// function hasAtIndex(letter: string, index: number): Feature {
//   const textIndex = (index >= 0 ? index + 1 : index).toString();
//   return {
//     name: `has ${letter} at index ${textIndex}`,
//     property: (slug) => {
//       return slug.at(index) === letter
//         ? `index(${slug}, ${textIndex}) = ${letter}`
//         : null;
//     },
//   };
// }
//
