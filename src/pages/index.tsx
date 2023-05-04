import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

import exampleWordData from './exampleWordData.json';

export default function Home() {
  /**
   * The possible states for the game are:
   * - running
   * - over
   *   - user submitted the target word
   *   - user submitted a synonym
   *   - user submitted an incorrect word
   *   - user gave up
   */

  const [gameIsRunning, setGameIsRunning] = useState(true);
  const [userSubmittedTargetWord, setUserSubmittedTargetWord] = useState(false);
  const [userSubmittedSynonym, setUserSubmittedSynonym] = useState(false);
  const [userSubmittedIncorrectWord, setUserSubmittedIncorrectWord] = useState(false);
  const [userGaveUp, setUserGaveUp] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSubmission, setUserSubmission] = useState("");

  // The commented out lines represent how the final logic will work.
  // const vocabListLength = vocabList.length;
  // TODO: this variable needs to be able to survive rerenders.
  // const randomIndex = Math.floor(Math.random() * vocabListLength);

  // const randomWordData = vocabList[currentWordIndex];
  const randomWordData = exampleWordData[currentWordIndex];
  const exampleSentence = randomWordData.example.replace(randomWordData.word, "_____");

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      checkSubmission();
    }
  };

  const checkSubmission = () => {
    if (userSubmission === randomWordData.word) {
      setUserSubmittedTargetWord(true);
    } else if (randomWordData.synonyms.some((synonym) => synonym === userSubmission)) {
      setUserSubmittedSynonym(true);
    } else {
      setUserSubmittedIncorrectWord(true);
    }

    setGameIsRunning(false);
  };

  const giveUp = () => {
    setUserGaveUp(true);
    setGameIsRunning(false);
  };

  const loadNextGame = () => {
    setGameIsRunning(true);
    setUserSubmittedTargetWord(false);
    setUserSubmittedSynonym(false);
    setUserSubmittedIncorrectWord(false);
    setUserGaveUp(false);
    // TODO: also update current word index, when we have more words
    setUserSubmission("");
  };

  const Synonyms = () => {
    const synonyms = randomWordData.synonyms;
    const filteredSynonyms = userSubmittedSynonym
      ? synonyms.filter((word) => word !== userSubmission)
      : synonyms;

    return (
      <div className={styles.synonyms}>
      We would also have accepted these {userSubmittedSynonym && "other "}synonyms:
      <ul className={styles.synonymList}>
        {filteredSynonyms.map((synonym) => (
          <li className={styles.synonym} key={`synonym-${synonym}`}>{synonym}</li>
        ))}
      </ul>
    </div>
    );
  };

  return (
    <>
      <Head>
        <title>Drawing a Blank</title>
        <meta name="description" content="Vocabulary builder using fill-in-the-blank format instead of flashcards" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div>
          <div className={styles.question}>
            <div className={styles.exampleSentence}>{exampleSentence}</div>
            <div className={styles.explanation}>What word with the following definition would you use to complete the sentence?</div>
            <div className={styles.definition}>{randomWordData.definition}</div>
          </div>

          <div className={styles.inputWrapper}>
            {/* TODO: add invisible label */}
            <input value={userSubmission} onChange={(event) => setUserSubmission(event.target.value)} onKeyUp={handleInputKeyUp}/>
          </div>

          <div className={styles.options}>
            <button onClick={checkSubmission} disabled={!userSubmission || !gameIsRunning}>Submit</button>
            <button onClick={giveUp}>I have no idea</button>
            <button onClick={loadNextGame}>Skip</button>
          </div>

          {!gameIsRunning && <div className={styles.postGameInfo}>
            <div className={styles.reaction}>
              {userSubmittedTargetWord && <div>Damn, you're good! That's exacly the word we were thinking of 🥰</div>}
              {userSubmittedSynonym && <div>Nice one! We were thinking of <strong>"{randomWordData.word}"</strong> but <strong>"{userSubmission}"</strong> is a good one too.</div>}
              {userSubmittedIncorrectWord && <div>Oops, not quite! We were thinking of <strong>"{randomWordData.word}".</strong> Good try though!</div>}
              {userGaveUp && <div>The word we were thinking of was <strong>"{randomWordData.word}".</strong></div>}
            </div>

            <Synonyms />

            <div className={styles.loadNextGame}>
              <button onClick={loadNextGame}>Gimme another one!</button>
            </div>
          </div>}
        </div>
      </main>
    </>
  )
}
