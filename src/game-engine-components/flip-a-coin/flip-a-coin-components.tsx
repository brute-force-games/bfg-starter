import { FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";
import { GameTableSeat } from "~/types/core/game-table/game-table";
import { FlipACoinRepresentation } from "./flip-a-coin-representation";
import { FlipACoinInput } from "./flip-a-coin-input";


export const createFlipACoinRepresentation = (
  myPlayerSeat: GameTableSeat,
  gameState: FlipACoinGameState
) => {
  return (
    <FlipACoinRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
  
}

export const createFlipACoinInput = (
  myPlayerSeat: GameTableSeat,
  gameState: FlipACoinGameState
) => {
  return (
    <FlipACoinInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
}


// export const createTicTacToeComboRepresentationAndInput = (
//   myPlayerSeat: GameTableSeat,
//   gameState: TicTacToeGameState,
//   onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
// ) => {
//   // return;

//   return (
//     <>
//       <TicTacToeGrid
//         myPlayerSeat={myPlayerSeat}
//         gameState={gameState}
//         onGameAction={onGameAction}
//       />
//     </>
//   )
// }
