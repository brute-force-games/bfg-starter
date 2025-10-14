// import { getCurrentPlayer, TicTacToeGameAction, TicTacToeGameState, TicTacToeMove } from "~/types/bfg-game-engines/tic-tac-toe-engine";
// import { TicTacToeInput } from "./tic-tac-toe-input";
// import { TicTacToeGrid } from "./tic-tac-toe-grid";
// import { TicTacToeRepresentation } from "./tic-tac-toe-representation";
// import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
// import { BfgGameSpecificTableAction } from "~/models/game-table/game-table-action";


// export const createTicTacToeRepresentation = (
//   myPlayerSeat: GameTableSeat,
//   gameState: TicTacToeGameState,
//   _mostRecentAction: TicTacToeGameAction
// ) => {
//   return (
//     <TicTacToeRepresentation 
//       myPlayerSeat={myPlayerSeat} 
//       gameState={gameState} 
//     />
//   );
  
// }

// export const createTicTacToeInput = (
//   myPlayerSeat: GameTableSeat,
//   gameState: TicTacToeGameState,
//   _mostRecentAction: TicTacToeGameAction,
//   _onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
// ) => {
//   return (
//     <TicTacToeInput 
//       myPlayerSeat={myPlayerSeat} 
//       gameState={gameState} 
//     />
//   );
// }


// export const createTicTacToeComboRepresentationAndInput = (
//   myPlayerSeat: GameTableSeat,
//   gameState: TicTacToeGameState,
//   _mostRecentAction: TicTacToeGameAction,
//   onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
// ) => {

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


// export const createTicTacToeHostRepresentation = (
//   _gameTable: GameTable,
//   gameState: TicTacToeGameState,
//   _mostRecentAction: TicTacToeGameAction,
//   onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
// ) => {
//   const currentPlayerSeat = getCurrentPlayer(gameState);
  
//   return (
//     <TicTacToeGrid 
//       myPlayerSeat={currentPlayerSeat}
//       gameState={gameState}
//       onGameAction={onGameAction}
//     />
//   )
// }


// export const createTicTacToeHistory = (
//   _myPlayerSeat: GameTableSeat,
//   _gameState: TicTacToeGameState,
//   _timeOrderedGameActions: BfgGameSpecificTableAction<TicTacToeGameAction>[]
// ) => {
//   return (
//     <>
//       Tic Tac Toe History
//       {/* {timeOrderedGameActions.map(action => (
//         <TicTacToeActionComponent
//           myPlayerSeat={myPlayerSeat}
//           key={action.gameTableActionId}
//           gameTable={gameTable}
//           action={action.gameSpecificAction}
//         />
//       ))} */}
//     </>
//   )
// }