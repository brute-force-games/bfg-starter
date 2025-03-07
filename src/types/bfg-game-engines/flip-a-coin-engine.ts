import { z } from "zod";
import { createBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { NewGameTable } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { createFlipACoinInput, createFlipACoinRepresentation } from "~/game-engine-components/flip-a-coin/flip-a-coin-components";
import { BfgSupportedGameTitle } from "./supported-games";


export const FlipACoinResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-heads-wins',
  'game-over-tails-wins',
])

export type FlipACoinResolution = z.infer<typeof FlipACoinResolutionSchema>;


export const FlipACoinOutcomeSchema = z.enum([
  'heads',
  'tails',
])

export type FlipACoinOutcome = z.infer<typeof FlipACoinOutcomeSchema>;


export const CoinChoiceSchema = z.enum([
  'penny',
  'nickel',
  'dime',
  'quarter',
])

export type CoinChoice = z.infer<typeof CoinChoiceSchema>;


export const FlipACoinStartGameSchema = z.object({
  actionType: z.literal('game-table-action-host-start-game'),
})

export type FlipACoinStartGame = z.infer<typeof FlipACoinStartGameSchema>;


export const FlipACoinActionChooseCoinSchema = z.object({
  actionType: z.literal('game-table-action-player-choose-coin'),
  chosenCoin: CoinChoiceSchema,
})


export const FlipACoinActionFlipCoinSchema = z.object({
  actionType: z.literal('game-table-action-player-flip-coin'),
  chosenCoin: CoinChoiceSchema,
  outcome: FlipACoinOutcomeSchema,
})

export const FlipACoinGameActionSchema = z.discriminatedUnion('actionType', [
  FlipACoinStartGameSchema,
  FlipACoinActionChooseCoinSchema, 
  FlipACoinActionFlipCoinSchema,
])

export type FlipACoinGameAction = z.infer<typeof FlipACoinGameActionSchema>;




// export const TicTacToeMoveSchema = z.object({
//   moveCell: TicTacToeMoveCellSchema,
//   movePlayer: GameTableSeatSchema,
// })

// export type TicTacToeMove = z.infer<typeof TicTacToeMoveSchema>;


export const FlipACoinGameStateSchema = z.object({
  // outcome: FlipACoinOutcomeSchema,
  // // currentPlayer: GameTableSeatSchema,
  // nextPlayersToAct: z.array(GameTableSeatSchema),
  // resolution: FlipACoinResolutionSchema,
  chosenCoin: CoinChoiceSchema,
  isFlipped: z.boolean(),
  outcome: FlipACoinOutcomeSchema.optional(),
}).describe('Flip A Coin');

export type FlipACoinGameState = z.infer<typeof FlipACoinGameStateSchema>;

export const FlipACoinGameName = 'Flip A Coin' as const;


// const initialGameState: FlipACoinGameState = {
//   isFlipped: false,
//   outcome: 'heads',
// }


const createInitialGameState = (
  initialGameTableAction: FlipACoinGameAction,
): FlipACoinGameState => {

  if (initialGameTableAction.actionType !== 'game-table-action-host-start-game') {
    throw new Error("Initial game table action must be a host start game");
  }

  return {
    chosenCoin: 'penny',
    isFlipped: false,
    outcome: undefined,
  };
}


const createInitialGameTableAction = (
  _gameTable: NewGameTable,
): FlipACoinGameAction => {
  return {
    actionType: 'game-table-action-host-start-game',
  };
}




const applyGameAction = (
  gameState: FlipACoinGameState,
  _gameAction: FlipACoinGameAction,
): GameTableActionResult<FlipACoinGameState> => {

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameState: gameState,
  };


  // const board = gameState.board;
  // // const currentPlayer = gameState.currentPlayer;
  // if (gameState.nextPlayersToAct.length !== 1) {
  //   throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  // }

  // // const currentPlayer = gameState.nextPlayersToAct[0];
  // const moveCell = gameAction.moveCell;
  // const movePlayer = gameAction.movePlayer;

  // const playerSymbol = movePlayer === 'p1' ? 'X' : 'O';

  // // Convert coordinate format (a1-c3) to array index
  // const col = moveCell[0].charCodeAt(0) - 'a'.charCodeAt(0);
  // const row = parseInt(moveCell[1]) - 1;
  // const moveIndex = row * 3 + col;

  // const boardArray = board.split('');
  // boardArray[moveIndex] = playerSymbol;
  // const newBoard = boardArray.join('');

  // const nextPlayersToAct = createNextPlayersToAct(gameAction, gameState);

  // const newGameState: TicTacToeGameState = {
  //   board: newBoard,
  //   // currentPlayer: currentPlayer === 'p1' ? 'p2' : 'p1', // Switch players
  //   nextPlayersToAct,
  //   resolution: 'game-in-progress' as TicTacToeResolution,
  // }

  // // Check for win conditions
  // const winPatterns = [
  //   [0,1,2], [3,4,5], [6,7,8], // Rows
  //   [0,3,6], [1,4,7], [2,5,8], // Columns
  //   [0,4,8], [2,4,6]           // Diagonals
  // ];

  // for (const pattern of winPatterns) {
  //   const [a, b, c] = pattern;
  //   if (newBoard[a] === playerSymbol && 
  //       newBoard[b] === playerSymbol && 
  //       newBoard[c] === playerSymbol)
  //   {
  //     newGameState.resolution = playerSymbol === 'X' ? 'game-over-x-wins' : 'game-over-o-wins';
  //     return {
  //       tablePhase: 'table-phase-game-complete-with-winners',
  //       gameState: newGameState,
  //     };
  //   }
  // }

  // // Check for draw
  // if (!newBoard.includes('-')) {
  //   newGameState.resolution = 'game-over-draw';
  //   return {
  //     tablePhase: 'table-phase-game-complete-with-draw',
  //     gameState: newGameState,
  //   };
  // }

  // return {
  //   tablePhase: 'table-phase-game-in-progress',
  //   gameState: newGameState,
  // };
}


export const FlipACoinGameStateProcessor = createBfgGameEngineProcessor(
  FlipACoinGameName as BfgSupportedGameTitle,
  FlipACoinGameStateSchema,
  FlipACoinGameActionSchema,

  applyGameAction,

  createInitialGameState,
  // createNextPlayersToAct,
  createInitialGameTableAction,

  createFlipACoinRepresentation,
  createFlipACoinInput,
  // createFlipACoinComboRepresentationAndInput,
);



// export const getCurrentPlayer = (gameState: TicTacToeGameState): GameTableSeat => {
//   if (gameState.nextPlayersToAct.length !== 1) {
//     throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
//   }
//   return gameState.nextPlayersToAct[0];
// }

// export const getPlayerSeatSymbol = (playerSeat: GameTableSeat) => {
//   switch (playerSeat) {
//     case "p1":
//       return "X";
//     case "p2":
//       return "O";
//     default:
//       return "Observer";
//   }
// }
