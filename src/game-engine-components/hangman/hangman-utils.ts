import { GameTableSeat } from "~/models/game-table/game-table";
import { HangmanGameState } from "~/types/bfg-game-engines/hangman-engine";


export const isHangmanGuessingActive = (gameState: HangmanGameState) => {
  return gameState.hiddenWordSource === null && gameState.hiddenWordInfo !== null;
}

export const getHiddenWordStatusLabel = (gameState: HangmanGameState, myPlayerSeat: GameTableSeat) => {
  const myPlayerHiddenWordSubmission = gameState.playerHiddenWordSubmissions
    .find(submission => submission.seat === myPlayerSeat);
  
  if (myPlayerHiddenWordSubmission) {
    return `Waiting for host to pick a hidden word (maybe yours)...`;
  }

  return "You have not set a hidden word yet.";  
}
