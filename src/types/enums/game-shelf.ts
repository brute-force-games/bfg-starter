import { z } from "zod";
import { AbfgSupportedGameTitle, BfgSupportedGameTitlesSchema, FlipACoinGameName, TicTacToeGameName } from "../bfg-game-engines/supported-games";


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
export type AvailableGameTitlesType = AbfgSupportedGameTitle;

// export const AvailableGameTitlesSchema = z.enum(AvailableGameTitles);

export const AvailableGameTitlesSchema = BfgSupportedGameTitlesSchema;

export type AvailableGameTitleChoice = AbfgSupportedGameTitle;




const GameDefinitionSchema = z.object({
  title: BfgSupportedGameTitlesSchema,
  minNumPlayersForGame: z.number().int().positive(),
  maxNumPlayersForGame: z.number().int().positive(),
});

export type GameDefinition = z.infer<typeof GameDefinitionSchema>;


export const TicTacToeGameDefinitionSchema = GameDefinitionSchema.extend({
  title: z.literal(TicTacToeGameName),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});


export type TicTacToeGameDefinition = z.infer<typeof TicTacToeGameDefinitionSchema>;

export const TicTacToeGameDefinition: TicTacToeGameDefinition = {
  title: TicTacToeGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2
};


export const HangmanGameDefinitionSchema = GameDefinitionSchema.extend({
  title: z.literal("Hangman"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(6),
});

export type HangmanGameDefinition = z.infer<typeof HangmanGameDefinitionSchema>;


export const BackgammonGameDefinitionSchema = GameDefinitionSchema.extend({
  title: z.literal("Backgammon"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});

export type BackgammonGameDefinition = z.infer<typeof BackgammonGameDefinitionSchema>;


export const ChessGameDefinitionSchema = GameDefinitionSchema.extend({
  title: z.literal("Chess"),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(2),
});

export type ChessGameDefinition = z.infer<typeof ChessGameDefinitionSchema>;


export const FlipACoinGameDefinitionSchema = GameDefinitionSchema.extend({
  title: z.literal(FlipACoinGameName),
  minNumPlayersForGame: z.literal(2),
  maxNumPlayersForGame: z.literal(6),
});

export type FlipACoinGameDefinition = z.infer<typeof FlipACoinGameDefinitionSchema>;

export const FlipACoinGameDefinition: FlipACoinGameDefinition = {
  title: FlipACoinGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 6
};
