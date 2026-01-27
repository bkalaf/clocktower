//scripts/getWordsEndS.ts
import words from './../eidolon_ngrams/ability_token_counts.json';

const endS = Object.keys(words).filter((x) => x.endsWith('s'));

console.log(endS);