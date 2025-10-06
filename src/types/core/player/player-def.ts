import { z } from "zod";
import { createAllPlayersSchema } from "./all-players";
import { BfgPlayerProfileId } from "../branded-values/bfg-branded-ids";


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
  playerKey: PlayerKeySchema,
  playerId: BfgPlayerProfileId.idSchema,
  playerName: z.string(),
});

export type PlayerDef = z.infer<typeof PlayerDefSchema>;

export const AllPlayerDefsSchema = createAllPlayersSchema(PlayerDefSchema);

export type AllPlayerDefs = z.infer<typeof AllPlayerDefsSchema>;
