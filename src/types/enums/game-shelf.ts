import { z } from "zod";
import { GameTitle } from "../core/branded-values/branded-strings";
import { BfgSupportedGameTitle, BfgSupportedGameTitlesSchema } from "../bfg-game-engines/supported-games";


// export const TIC_TAC_TOE_GAME_TITLE = "Tic Tac Toe" as const;
// export const HANGMAN_GAME_TITLE = "Hangman" as const;
// export const BACKGAMMON_GAME_TITLE = "Backgammon" as const;
// export const CHESS_GAME_TITLE = "Chess" as const;
// export const FLIP_A_COIN_GAME_TITLE = "Flip a Coin" as const;


// export const AvailableGameTitles = [
//   FLIP_A_COIN_GAME_TITLE,
//   TIC_TAC_TOE_GAME_TITLE,
//   HANGMAN_GAME_TITLE,
//   BACKGAMMON_GAME_TITLE,
//   CHESS_GAME_TITLE,
// ] as const;

// export type AvailableGameTitlesType = typeof AvailableGameTitles;
export type AvailableGameTitlesType = BfgSupportedGameTitle;

// export const AvailableGameTitlesSchema = z.enum(AvailableGameTitles);

export const AvailableGameTitlesSchema = BfgSupportedGameTitlesSchema;

// export type AvailableGameTitleChoice = z.infer<typeof AvailableGameTitlesSchema>;
export type AvailableGameTitleChoice = BfgSupportedGameTitle;




const GameDefinitionSchema = z.object({
  title: AvailableGameTitlesSchema,
  minNumPlayersForGame: z.number().int().positive(),
  maxNumPlayersForGame: z.number().int().positive(),
});

export type GameDefinition = z.infer<typeof GameDefinitionSchema>;


export const TicTacToeGameDefinition = GameDefinitionSchema.extend({
  title: z.literal("Tic Tac Toe"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});

export type TicTacToeGameDefinition = z.infer<typeof TicTacToeGameDefinition>;

export const HangmanGameDefinition = GameDefinitionSchema.extend({
  title: z.literal("Hangman"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(6),
});

export type HangmanGameDefinition = z.infer<typeof HangmanGameDefinition>;

export const BackgammonGameDefinition = GameDefinitionSchema.extend({
  title: z.literal("Backgammon"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});

export type BackgammonGameDefinition = z.infer<typeof BackgammonGameDefinition>;

export const ChessGameDefinition = GameDefinitionSchema.extend({
  title: z.literal("Chess"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});

export type ChessGameDefinition = z.infer<typeof ChessGameDefinition>;








// export const GameOnShelf = {
//   TIC_TAC_TOE: "Tic Tac Toe",
//   HANGMAN: "Hangman",
//   BACKGAMMON: "Backgammon",
//   CHESS: "Chess",
// } as const;

const AllGamesOnShelf = [
  TicTacToeGameDefinition,
  HangmanGameDefinition,
  BackgammonGameDefinition,
  ChessGameDefinition,
] as const;


export const AllGamesOnShelfSchema = z.discriminatedUnion("title", AllGamesOnShelf);

// export const AllGameTitles = AllGamesOnShelfSchema.options.map(x => x.shape.title._def.value);

// export type AllGameTitles = typeof AllGameTitles;


// console.log(AllGameTitles);

export const AllGamesOnShelfArray = [
  TicTacToeGameDefinition.parse({ title: "Tic Tac Toe", minNumPlayersForGame: 2, maxNumPlayersForGame: 2 }),
  HangmanGameDefinition.parse({ title: "Hangman", minNumPlayersForGame: 2, maxNumPlayersForGame: 6 }),
  BackgammonGameDefinition.parse({ title: "Backgammon", minNumPlayersForGame: 2, maxNumPlayersForGame: 2 }),
  ChessGameDefinition.parse({ title: "Chess", minNumPlayersForGame: 2, maxNumPlayersForGame: 2 }),
] as const;

export type AllGamesOnShelf = z.infer<typeof AllGamesOnShelfSchema>;

export type AllGamesOnShelfOptions = z.infer<typeof AllGamesOnShelfSchema>;


export const GameTitles = AllGamesOnShelf.map(game => 
  game.shape.title._def.value) as [GameTitle, ...GameTitle[]];

export const GameOnShelfSchema = z.enum(GameTitles);



export type GameOnShelf = z.infer<typeof GameOnShelfSchema>;
