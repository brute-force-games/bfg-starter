import { GameTableSeat } from "~/models/game-table/game-table";
import { HangmanGameAction, HangmanGameState } from "~/types/bfg-game-engines/hangman-engine";
import { HangmanStickFigure } from "./hangman-stick-figure";
import { getHiddenWordStatusLabel, isHangmanGuessingActive } from "../hangman-utils";


interface HangmanRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: HangmanGameState;
  mostRecentAction: HangmanGameAction;
}

export const HangmanRepresentation = ({
  myPlayerSeat,
  gameState,
}: HangmanRepresentationProps) => {
  // const isGameActive = isHangmanGuessingActive(gameState);

  // if (!isGameActive) {
  //   console.log('HangmanRepresentation: isGameActive', gameState);
  //   return (
  //     <div>
  //       Waiting for game to start...
  //     </div>
  //   );
  // }


  const gameActive = isHangmanGuessingActive(gameState);

  console.log("createHangmanRepresentation", gameActive);

  if (!gameActive) {
    const hiddenWordStatusLabel = getHiddenWordStatusLabel(gameState, myPlayerSeat);

    return (
      <div>
        {hiddenWordStatusLabel}
      </div>
    );
  }

  if (!gameState.hiddenWordInfo) {
    console.log('HangmanRepresentation: gameState', gameState);
    throw new Error("Hidden word info is required for hangman representation");
  }

  const maxWrongGuesses = gameState.hiddenWordInfo.numberOfWrongGuessesToLose;
  const wrongGuesses = gameState.numberOfWrongGuesses;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* <h3>Hangman Game</h3> */}
      
      {/* Game Outcome */}
      {gameState.isGameOver && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: gameState.outcomeSummary?.includes('won') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${gameState.outcomeSummary?.includes('won') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {gameState.outcomeSummary}
        </div>
      )}

      {/* Word Display */}
      {gameState.hiddenWordState && (
        <div style={{ margin: '20px 0', fontSize: '24px', letterSpacing: '8px', fontFamily: 'monospace' }}>
          {gameState.hiddenWordState}
        </div>
      )}

      {/* Stick Figure */}
      <HangmanStickFigure wrongGuesses={wrongGuesses} maxWrongGuesses={maxWrongGuesses} />

      {/* Game Status */}
      <div style={{ margin: '20px 0' }}>
        <div>Wrong Guesses: {wrongGuesses} / {maxWrongGuesses}</div>
        <div>Letters Guessed: {gameState.lettersGuessed.join(', ')}</div>
      </div>


    </div>
  );
};
