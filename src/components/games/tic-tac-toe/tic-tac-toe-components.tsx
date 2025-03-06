import { TicTacToeGameState, TicTacToeMove } from "~/types/game-engines/tic-tac-toe-engine";
import { TicTacToeInput } from "./tic-tac-toe-input";
import { TicTacToeGrid } from "./tic-tac-toe-grid";
import { TicTacToeRepresentation } from "./tic-tac-toe-representation";


export const createTicTacToeRepresentation = (gameState: TicTacToeGameState) => {
  return <TicTacToeRepresentation gameState={gameState} />;
  
}

export const createTicTacToeInput = (gameState: TicTacToeGameState) => {
  return <TicTacToeInput gameState={gameState} />;
}


export const createTicTacToeComboRepresentationAndInput = (
  gameState: TicTacToeGameState,
  onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {
  // return;

  return (
    <>
      <TicTacToeGrid
        gameState={gameState}
        onGameAction={onGameAction}
      />
    </>
  )
}
