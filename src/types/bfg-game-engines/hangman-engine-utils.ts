import { HiddenWordInfo } from "./hangman-engine";


export const getWordInfoFromInternalWordList = (): HiddenWordInfo => {

  // TODO: Make this configurable
  const wordList = [
    'mustang',
    'dog',
    'cat',
    'bird',
    'fish',
  ];

  const randomIndex = Math.floor(Math.random() * wordList.length);

  return {
    hiddenWord: wordList[randomIndex],
    numberOfWrongGuessesToLose: 10,
  };
}