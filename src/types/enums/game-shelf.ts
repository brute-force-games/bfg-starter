import { z } from "zod";


export const GameOnShelf = {
  TIC_TAC_TOE: "Tic Tac Toe",
  HANGMAN: "Hangman",
  BACKGAMMON: "Backgammon",
  CHESS: "Chess",
} as const;


export const GameOnShelfSchema = z.enum([
  "TIC_TAC_TOE",
  "HANGMAN",
  "BACKGAMMON",
  "CHESS",
]);


export type GameOnShelf = z.infer<typeof GameOnShelfSchema>;
