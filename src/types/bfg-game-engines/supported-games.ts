import { z } from "zod";


export const TicTacToeGameName = 'Tic Tac Toe' as const;
export const FlipACoinGameName = 'Flip a Coin' as const;


export const BfgSupportedGameTitlesSchema = z.enum([
  TicTacToeGameName,
  FlipACoinGameName,
] as const);

export type BfgSupportedGameTitle = z.infer<typeof BfgSupportedGameTitlesSchema>;


export const BfgGameDataJsonTypesSchema = z.enum([
  'game-state',
  'game-action',
] as const);

export type BfgGameDataJsonType = z.infer<typeof BfgGameDataJsonTypesSchema>;


export const AvailableGameTitles = BfgSupportedGameTitlesSchema.options;
