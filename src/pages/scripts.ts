// TODO: rename file
import wordList from "./vocabList";
import wordFrequencyData from "./wordFrequencyData";
import vocabList from "./vocabData";

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
  vocabList.forEach((wordData) => {
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
  //   const noDuplicates = vocabList.filter(
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

  // Check for missing definitions
  const definitionsMissing: Array<string> = [];
  wordList.forEach((word) => {
    if (!(word in wordMap)) {
      definitionsMissing.push(word);
    }
  });
  if (definitionsMissing.length) {
    console.log(
      "We're missing definitions for the following words: ",
      JSON.stringify(definitionsMissing, null, 2)
    );
  }

  // Sort the frequency list; useful if you've just added a new segment from another fetch.
  // const sorted = wordFrequencyData.sort((wordDataA, wordDataB) => {
  //   return wordDataA.frequency - wordDataB.frequency;
  // });
  // console.log("Sorted frequency data: ", JSON.stringify(sorted, null, 2));

  // Verify the example sentences have the actual word in them
  // interface SentenceMissingWord {
  //   word: string;
  //   invalidSentences: Array<string>;
  // }
  // const sentencesMissingWord: Array<SentenceMissingWord> = [];
  // vocabList.forEach((data) => {
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
};

export default runAllChecks;

// const list = [

// ];
