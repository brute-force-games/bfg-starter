import { z } from "zod";
import { PlayerIdSchema } from "../branded-values/bs-player-id";



export const PlayerInGameStatusSchema = z.enum([
  'IN_GAME',
  'ELIMINATED',
  'RETIRED',
]);

export type PlayerInGameStatus = z.infer<typeof PlayerInGameStatusSchema>;


export const PlayerInLobbySchema = z.object({
  playerId: PlayerIdSchema,
  name: z.string().readonly(),
});

export type PlayerInLobby = z.infer<typeof PlayerInLobbySchema>;


// export const PlayerInGameSchema = PlayerInLobbySchema.extend({
//   // gamePlayerId: GamePlayerIdSchema,
//   playerData: CompletePlayerDataSchema,
//   status: PlayerInGameStatusSchema,
// });

// export type PlayerInGame = z.infer<typeof PlayerInGameSchema>;


// // Player state
// export const PlayerStateSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   illuminati: IlluminatiCardSchema,
//   powerStructure: PowerStructureSchema,
//   specialCards: z.array(z.string()), // IDs of special cards
//   treasury: z.number(),
//   isConnected: z.boolean(),
//   actionsRemaining: z.number(),
//   hasUsedIlluminatiPower: z.boolean()
// });