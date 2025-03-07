import { z } from "zod";
import { createBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { GameTableSeat, GameTableSeatSchema, NewGameTable } from "../core/game-table/game-table";
import { createTicTacToeRepresentation, createTicTacToeInput, createTicTacToeComboRepresentationAndInput } from "~/game-engine-components/tic-tac-toe/tic-tac-toe-components";
import { GameTableActionResult } from "../core/game-table/table-phase";


export const TicTacToeResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-draw',
  'game-over-x-wins',
  'game-over-o-wins',
])

export type TicTacToeResolution = z.infer<typeof TicTacToeResolutionSchema>;


export const TicTacToeMoveCellSchema = z.enum([
  'a1', 'b1', 'c1',
  'a2', 'b2', 'c2',
  'a3', 'b3', 'c3',
])

export type TicTacToeMoveCell = z.infer<typeof TicTacToeMoveCellSchema>;


export const TicTacToeSetupBoardSchema = z.object({
  actionType: z.literal('game-table-action-host-setup-board'),
  board: z.string().length(9),
})

export type TicTacToeSetupBoard = z.infer<typeof TicTacToeSetupBoardSchema>;


export const TicTacToeMoveSchema = z.object({
  actionType: z.literal('game-table-action-player-move'),
  moveCell: TicTacToeMoveCellSchema,
  movePlayer: GameTableSeatSchema,
})

export type TicTacToeMove = z.infer<typeof TicTacToeMoveSchema>;


export const TicTacToeGameActionSchema = z.discriminatedUnion('actionType', [
  TicTacToeSetupBoardSchema,
  TicTacToeMoveSchema,
])

export type TicTacToeGameAction = z.infer<typeof TicTacToeGameActionSchema>;


export const TicTacToeGameStateSchema = z.object({
  board: z.string().length(9),
  // currentPlayer: GameTableSeatSchema,
  nextPlayersToAct: z.array(GameTableSeatSchema),
  resolution: TicTacToeResolutionSchema,
}).describe('Tic Tac Toe');

export type TicTacToeGameState = z.infer<typeof TicTacToeGameStateSchema>;

export const TicTacToeGameName = 'Tic Tac Toe' as const;


// const initialGameState: TicTacToeGameState = {
//   board: "---------",
//   // currentPlayer: 'p1' as GameTableSeat,
//   nextPlayersToAct: ['p1'],
//   resolution: 'game-in-progress' as TicTacToeResolution,
// }


const createInitialGameState = (
  initialGameTableAction: TicTacToeGameAction,
): TicTacToeGameState => {

  if (initialGameTableAction.actionType !== 'game-table-action-host-setup-board') {
    throw new Error("Initial game table action must be a host setup board");
  }

  return {
    board: initialGameTableAction.board,
    nextPlayersToAct: ['p1'],
    resolution: 'game-in-progress' as TicTacToeResolution,
  }
}


const createInitialGameTableAction = (
  _gameTable: NewGameTable,
): TicTacToeGameAction => {
  return {
    actionType: 'game-table-action-host-setup-board',
    board: "---------",
  };
}


const createNextPlayersToAct = (gameAction: TicTacToeMove, _gameState: TicTacToeGameState): GameTableSeat[] => {
  if (gameAction.movePlayer === 'p2') {
    return ['p1'];
  }

  return ['p2'];
}


const applyGameAction = (
  gameState: TicTacToeGameState,
  gameAction: TicTacToeGameAction,
): GameTableActionResult<TicTacToeGameState> => {

  if (gameAction.actionType === 'game-table-action-host-setup-board') {
    throw new Error("Host setup board is not a valid game action");
  }

  const board = gameState.board;
  // const currentPlayer = gameState.currentPlayer;
  if (gameState.nextPlayersToAct.length !== 1) {
    throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  }

  // const currentPlayer = gameState.nextPlayersToAct[0];
  const moveCell = gameAction.moveCell;
  const movePlayer = gameAction.movePlayer;

  const playerSymbol = movePlayer === 'p1' ? 'X' : 'O';

  // Convert coordinate format (a1-c3) to array index
  const col = moveCell[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const row = parseInt(moveCell[1]) - 1;
  const moveIndex = row * 3 + col;

  const boardArray = board.split('');
  boardArray[moveIndex] = playerSymbol;
  const newBoard = boardArray.join('');

  const nextPlayersToAct = createNextPlayersToAct(gameAction, gameState);

  const newGameState: TicTacToeGameState = {
    board: newBoard,
    // currentPlayer: currentPlayer === 'p1' ? 'p2' : 'p1', // Switch players
    nextPlayersToAct,
    resolution: 'game-in-progress' as TicTacToeResolution,
  }

  // Check for win conditions
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (newBoard[a] === playerSymbol && 
        newBoard[b] === playerSymbol && 
        newBoard[c] === playerSymbol)
    {
      newGameState.resolution = playerSymbol === 'X' ? 'game-over-x-wins' : 'game-over-o-wins';
      return {
        tablePhase: 'table-phase-game-complete-with-winners',
        gameState: newGameState,
      };
    }
  }

  // Check for draw
  if (!newBoard.includes('-')) {
    newGameState.resolution = 'game-over-draw';
    return {
      tablePhase: 'table-phase-game-complete-with-draw',
      gameState: newGameState,
    };
  }

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameState: newGameState,
  };
}


export const TicTacToeGameStateProcessor = createBfgGameEngineProcessor(
  TicTacToeGameStateSchema,
  TicTacToeGameActionSchema,

  applyGameAction,

  createInitialGameState,
  // createNextPlayersToAct,
  createInitialGameTableAction,

  createTicTacToeRepresentation,
  createTicTacToeInput,
  createTicTacToeComboRepresentationAndInput,
);



export const getCurrentPlayer = (gameState: TicTacToeGameState): GameTableSeat => {
  if (gameState.nextPlayersToAct.length !== 1) {
    throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  }
  return gameState.nextPlayersToAct[0];
}

export const getPlayerSeatSymbol = (playerSeat: GameTableSeat) => {
  switch (playerSeat) {
    case "p1":
      return "X";
    case "p2":
      return "O";
    default:
      return "Observer";
  }
}
