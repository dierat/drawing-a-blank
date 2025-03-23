import Head from "next/head";
import { Inter } from "next/font/google";
import globalStyles from "@/styles/Global.module.css";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

import ContactForm from '../components/ContactForm';
import vocabData from "../utils/vocabData";
import runAllChecks from "../utils/scripts";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

export default function Home() {
  runAllChecks();

  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * The possible states for the game are:
   * - loading
   * - running
   *   - waiting for user to submit answer or give up
   * - over
   *   - user submitted the target word
   *   - user submitted a synonym
   *   - user submitted an incorrect word
   *   - user gave up
   */
  const [gameIsLoading, setGameIsLoading] = useState(true);
  const [gameIsRunning, setGameIsRunning] = useState(true);

  const [userSubmittedTargetWord, setUserSubmittedTargetWord] = useState(false);
  const [userSubmittedSynonym, setUserSubmittedSynonym] = useState(false);
  const [userSubmittedIncorrectWord, setUserSubmittedIncorrectWord] =
    useState(false);
  const [userGaveUp, setUserGaveUp] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  
  const [userSubmission, setUserSubmission] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  // inputVisible is necessary to trigger the auto-focus functionality
  const [inputVisible, setInputVisible] = useState(false);

  const startNewGame = () => {
    // Pick next word + sentence
    const randomWordIndex = Math.floor(Math.random() * vocabData.length);
    const randomSentenceIndex = Math.floor(
      Math.random() * vocabData[randomWordIndex].exampleSentences.length
    );

    // Clear previous game state (if this is not the first round)
    setUserSubmittedTargetWord(false);
    setUserSubmittedSynonym(false);
    setUserSubmittedIncorrectWord(false);
    setUserGaveUp(false);
    setUserSubmission("");
    setGameIsRunning(true);

    // Load next word
    setCurrentWordIndex(randomWordIndex);
    setCurrentSentenceIndex(randomSentenceIndex);

    // Reveal the game UI (if this is the first round)
    setGameIsLoading(false);

    // Auto-focus on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    // Auto-focus on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible, gameIsRunning]);

  const currentWordData = vocabData[currentWordIndex];
  const exampleSentence = currentWordData.exampleSentences[
    currentSentenceIndex
  ].replace(currentWordData.word, "_____");

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && !!userSubmission) {
      checkSubmission();
    }
  };

  const checkSubmission = () => {
    const cleanedSubmission = userSubmission.toLocaleLowerCase().trim();

    if (cleanedSubmission === currentWordData.word || currentWordData.alternateSpellings?.includes(cleanedSubmission)) {
      setUserSubmittedTargetWord(true);
    } else if (
      currentWordData.synonyms.some((synonym) => synonym === cleanedSubmission)
    ) {
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

  const Synonyms = () => {
    const synonyms = currentWordData.synonyms;
    const filteredSynonyms = userSubmittedSynonym
      ? synonyms.filter((word) => word !== userSubmission.toLocaleLowerCase().trim())
      : synonyms;

    if (!filteredSynonyms.length) {
      return null;
    }

    return (
      <div className={styles.synonyms}>
        <h2>
          We would also have accepted these {userSubmittedSynonym && "other "}
          synonyms:
        </h2>
        <ul className={styles.synonymList}>
          {filteredSynonyms.map((synonym) => (
            <li className={styles.synonym} key={`synonym-${synonym}`}>
              {synonym}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Drawing a Blank</title>
        <meta
          name="description"
          content="Vocabulary builder using fill-in-the-blank format instead of flashcards"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {!gameIsLoading && <div>
          <div className={styles.question}>
            <div className={styles.exampleSentenceWrapper}>
              <h1 className={styles.exampleSentence}>{exampleSentence}</h1>
              <button onClick={onOpen} className={globalStyles.iconButton}>
                {/* TODO: does this work for screen readers? */}
                <title>report word</title>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" height="24" width="24" viewBox="0 0 60 60"><path d="M51.371 3.146c-.203-.081-5.06-1.997-10.815-1.997-3.434 0-6.47.687-9.024 2.042C29.269 4.392 26.199 5 22.407 5 17.099 5 11.865 3.788 10 3.307V1a1 1 0 1 0-2 0v3c0 .014.007.026.008.04S8 4.062 8 4.074V33v1.074V59a1 1 0 1 0 2 0V35.373C12.273 35.937 17.243 37 22.407 37c4.122 0 7.507-.688 10.062-2.042 2.263-1.201 4.983-1.81 8.087-1.81 5.357 0 10.027 1.836 10.073 1.854a.99.99 0 0 0 .932-.102c.274-.184.439-.494.439-.826v-30a1 1 0 0 0-.629-.928z"/></svg>
              </button>
            </div>
            <div className={styles.explanation}>
              What word with the following definition would you use to complete
              the above sentence?
            </div>
            <div className={styles.definition}>{currentWordData.definition}</div>
          </div>

          <div className={styles.inputWrapper}>
            {/* TODO: add invisible label */}
            <input
              value={userSubmission}
              onChange={(event) => setUserSubmission(event.target.value)}
              onKeyUp={handleInputKeyUp}
              ref={element => {
                inputRef.current = element;
                setInputVisible(!!element);
              }}
              disabled={!gameIsRunning}
            />
          </div>

          <div className={styles.options}>
            <button
              onClick={checkSubmission}
              disabled={!userSubmission || !gameIsRunning}
            >
              Submit
            </button>
            <button onClick={giveUp} disabled={!gameIsRunning}>
              I have no idea
            </button>
            <button onClick={startNewGame} disabled={!gameIsRunning}>
              Skip
            </button>
          </div>

          {!gameIsRunning && (
            <div className={styles.postGameInfo}>
              <div className={styles.reaction}>
                {userSubmittedTargetWord && (
                  <div>
                    Damn, you're good! That's exacly the word we were thinking
                    of 🥰
                  </div>
                )}
                {userSubmittedSynonym && (
                  <div>
                    Nice one! We were thinking of{" "}
                    <strong>"{currentWordData.word}"</strong>, but{" "}
                    <strong>"{userSubmission}"</strong> is a good one too.
                  </div>
                )}
                {userSubmittedIncorrectWord && (
                  <div>
                    Oops, not quite! We were thinking of{" "}
                    <strong>"{currentWordData.word}".</strong> Good try though!
                  </div>
                )}
                {userGaveUp && (
                  <div>
                    The word we were thinking of was{" "}
                    <strong>"{currentWordData.word}".</strong>
                  </div>
                )}
              </div>

              <Synonyms />

              <div className={styles.loadNextGame}>
                <button onClick={startNewGame}>Gimme another one!</button>
              </div>
            </div>
          )}
        </div>}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay className={styles.modalOverlay} />
          <ModalContent className={styles.modalContent}>
            <ContactForm word={currentWordData.word} />
          </ModalContent>
        </Modal>

        {/* TODO: move to modal */}
        {/* <ContactForm word={currentWordData.word} /> */}
      </main>
    </>
  );
}
