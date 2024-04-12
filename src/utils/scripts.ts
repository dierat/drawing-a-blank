// TODO: rename file
import vocabData from "./vocabData";

// TODO: change some of these into tests that run on save
// TODO: split the others into separate scripts in a /scripts directory

// Set up data structure to easily search for definitions
interface WordMap {
  [word: string]: boolean;
}
const wordMap: WordMap = {};

const runAllChecks = () => {
  // Check for duplicate definitions
  const duplicates: Array<string> = [];
  vocabData.forEach((wordData) => {
    const { word } = wordData;
    if (word in wordMap) {
      duplicates.push(word);
    } else {
      // TODO: move this map buildup code out so you can find missing definitions without looking
      // for duplicates.
      wordMap[word] = true;
    }
  });
  // if (duplicates.length) {
  //   console.log(
  //     `There are duplicate words in vocabData.ts: ${duplicates.join(", ")}`
  //   );
  //   const noDuplicates = vocabData.filter(
  //     (definitionObject) =>
  //       !duplicates.some((word) => definitionObject.word === word)
  //   );
  //   console.log(
  //     "Here's the list of definitions with no duplicates: ",
  //     JSON.stringify(noDuplicates, null, 2)
  //   );
  // } else {
  //   console.log(`There are no duplicates in vocabData.ts 👍🏻`);
  // }

  // Verify the example sentences have the actual word in them
  // interface SentenceMissingWord {
  //   word: string;
  //   invalidSentences: Array<string>;
  // }
  // const sentencesMissingWord: Array<SentenceMissingWord> = [];
  // vocabData.forEach((data) => {
  //   const { word, exampleSentences } = data;
  //   const lowercaseWord = word.toLowerCase();

  //   const invalidSentences: Array<string> = [];
  //   exampleSentences.forEach((sentence) => {
  //     if (!sentence.toLocaleLowerCase().includes(lowercaseWord)) {
  //       invalidSentences.push(sentence);
  //     }
  //   });

  //   if (invalidSentences.length) {
  //     sentencesMissingWord.push({
  //       word,
  //       invalidSentences,
  //     });
  //   }
  // });
  // if (sentencesMissingWord.length) {
  //   console.log(
  //     `Some example sentences don't contain the word they're describing: `,
  //     JSON.stringify(sentencesMissingWord, null, 2)
  //   );
  // }

  // const hasSynonymInDefinition: Array<string> = [];
  // vocabData.forEach((word) => {
  //   const { definition, synonyms } = word;

  //   for (let index = 0; index < synonyms.length; index++) {
  //     const synonym = synonyms[index];
  //     if (definition.includes(synonym)) {
  //       hasSynonymInDefinition.push(word.word);
  //       // Skip the rest of the synonyms; there might be more than one
  //       // synonym in the definition, but that's not important now
  //       break;
  //     }
  //   }
  // });
  // console.log(
  //   "These words have a synonym in the definition: ",
  //   JSON.stringify(hasSynonymInDefinition, null, 2)
  // );
};

export default runAllChecks;
