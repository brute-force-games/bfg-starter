import { TicTacToeGameState, TicTacToeMove } from "~/types/game-engines/tic-tac-toe-engine";
import { TicTacToeInput } from "./tic-tac-toe-input";
import { TicTacToeGrid } from "./tic-tac-toe-grid";
import { TicTacToeRepresentation } from "./tic-tac-toe-representation";
import { GameTableSeat } from "~/types/core/game-table/game-table";


export const createTicTacToeRepresentation = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState
) => {
  return (
    <TicTacToeRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
  
}

export const createTicTacToeInput = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState
) => {
  return (
    <TicTacToeInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
}


export const createTicTacToeComboRepresentationAndInput = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState,
  onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {
  // return;

  return (
    <>
      <TicTacToeGrid
        myPlayerSeat={myPlayerSeat}
        gameState={gameState}
        onGameAction={onGameAction}
      />
    </>
  )
}
