import { z } from "zod";
import { BfgPlayerProfileId } from "../branded-values/bfg-branded-ids";


export const PlayerInGameStatusSchema = z.enum([
  'IN_GAME',
  'ELIMINATED',
  'RETIRED',
]);

export type PlayerInGameStatus = z.infer<typeof PlayerInGameStatusSchema>;


export const PlayerInLobbySchema = z.object({
  
  profileId: BfgPlayerProfileId.idSchema,
  name: z.string().readonly(),
});

export type PlayerInLobby = z.infer<typeof PlayerInLobbySchema>;
