import { z } from "zod";
import { GameLobbySchema } from "./game-lobby/game-lobby";


export const GameTableSchema = z.object({
  id: z.string(),
  name: z.string(),

  lobby: GameLobbySchema,
  // description: z.string(),
  // image: z.string(),
});


export type GameTable = z.infer<typeof GameTableSchema>;
