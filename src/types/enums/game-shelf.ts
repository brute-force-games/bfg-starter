import { z } from "zod";
import {
  AbfgSupportedGameTitle,
  BfgSupportedGameTitlesSchema,
  FlipACoinGameName,
  HangmanGameName,
  TicTacToeGameName,
} from "../bfg-game-engines/supported-games";


export type AvailableGameTitlesType = AbfgSupportedGameTitle;


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
  minNumPlayersForGame: z.literal(1),
  maxNumPlayersForGame: z.literal(6),
});

export type HangmanGameDefinition = z.infer<typeof HangmanGameDefinitionSchema>;

export const HangmanGameDefinition: HangmanGameDefinition = {
  title: HangmanGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};



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
  minNumPlayersForGame: z.literal(1),
  maxNumPlayersForGame: z.literal(6),
});

export type FlipACoinGameDefinition = z.infer<typeof FlipACoinGameDefinitionSchema>;

export const FlipACoinGameDefinition: FlipACoinGameDefinition = {
  title: FlipACoinGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};
