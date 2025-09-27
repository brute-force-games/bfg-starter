import { z } from "zod";
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games";
import { BfgGameLobbyId, BfgGameTableId, BfgPlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { PublicPlayerProfileSchema } from "./public-player-profile";


// export const LOBBY_SEATS = [
//   'p1',
//   'p2',
//   'p3',
//   'p4',
//   'p5',
//   'p6',
//   'p7',
//   'p8',
// ] as const;


// export const LobbySeatSchema = z.enum(LOBBY_SEATS);

// export type GameLobbySeat = z.infer<typeof LobbySeatSchema>;


export const LobbyOptionsSchema = z.object({
  gameChoices: z.array(BfgSupportedGameTitlesSchema),
  maxPlayers: z.number(),
});

export type LobbyOptions = z.infer<typeof LobbyOptionsSchema>;



export const LobbySchema = z.object({
  id: BfgGameLobbyId.idSchema,
  createdAt: z.number(),
  gameHostPlayerProfile: PublicPlayerProfileSchema,

  lobbyName: z.string(),
  currentStatusDescription: z.string(),

  gameTitle: BfgSupportedGameTitlesSchema.optional(),

  gameTableId: BfgGameTableId.idSchema.optional(),
  gameLink: z.string().optional(),

  playerPool: z.array(BfgPlayerProfileId.idSchema),
  maxNumPlayers: z.number(),

  updatedAt: z.number(),
});

export type GameLobby = z.infer<typeof LobbySchema>;
