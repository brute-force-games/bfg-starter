import { z } from "zod";
import { createAllPlayersSchema } from "./all-players";
import { BfgPlayerIdSchema } from "../branded-values/bs-player-id";


export const PlayerKeySchema = z.union([
  z.literal('p1').brand('PlayerKey'),
  z.literal('p2').brand('PlayerKey'),
  z.literal('p3').brand('PlayerKey'),
  z.literal('p4').brand('PlayerKey'),
  z.literal('p5').brand('PlayerKey'),
  z.literal('p6').brand('PlayerKey'),
]);

export type PlayerKey = z.infer<typeof PlayerKeySchema>;

export const PlayerIndexSchema = z.number().nonnegative().brand('PlayerIndex');

export type PlayerIndex = z.infer<typeof PlayerIndexSchema>;

export const PlayerDefSchema = z.object({
  // playerIndex: PlayerIndexSchema,
  playerKey: PlayerKeySchema,
  playerId: BfgPlayerIdSchema,
  playerName: z.string(),
});

export type PlayerDef = z.infer<typeof PlayerDefSchema>;


// export type AllPlayerDefs = PlayerDef[];
// export type AllPlayerDefs = { [key: PlayerIndex]: PlayerDef };

// export type AllPlayerDefsJson = { [key: PlayerIndex]: PlayerDefJson };

export const AllPlayerDefsSchema = createAllPlayersSchema(PlayerDefSchema);

export type AllPlayerDefs = z.infer<typeof AllPlayerDefsSchema>;
