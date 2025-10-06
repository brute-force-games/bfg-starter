import { z } from "zod";
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games";
import { BfgGameLobbyId, BfgGameTableId, BfgPlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { PublicPlayerProfileSchema } from "./public-player-profile";


export const LobbyOptionsSchema = z.object({
  gameChoices: z.array(BfgSupportedGameTitlesSchema),
  // maxPlayers: z.number(),
});

export type LobbyOptions = z.infer<typeof LobbyOptionsSchema>;



export const LobbySchema = z.object({
  id: BfgGameLobbyId.idSchema,
  createdAt: z.number(),
  gameHostPlayerProfile: PublicPlayerProfileSchema,

  lobbyName: z.string(),
  currentStatusDescription: z.string(),
  isLobbyValid: z.boolean(),

  gameTitle: BfgSupportedGameTitlesSchema.optional(),

  gameTableId: BfgGameTableId.idSchema.optional(),
  gameLink: z.string().optional(),

  playerPool: z.array(BfgPlayerProfileId.idSchema),
  minNumPlayers: z.number(),
  maxNumPlayers: z.number(),

  updatedAt: z.number(),
});

export type GameLobby = z.infer<typeof LobbySchema>;
