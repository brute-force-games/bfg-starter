import { z } from "zod";
import { GameFriendId, GameLobbyId, PlayerProfileId } from "./bfg-branded-ids";


export const DexieCloudEmailSchema = z.string().brand('DbkDexieCloudEmail');
export type DexieCloudEmail = z.infer<typeof DexieCloudEmailSchema>;

export const GameTitleSchema = z.string().brand('BfgGameTitle');
export type GameTitle = z.infer<typeof GameTitleSchema>;

// export const DbGameLobbyIdSchema = z.string().brand('DbGameLobbyId');
// export type DbGameLobbyId = z.infer<typeof DbGameLobbyIdSchema>;

// // export const DbGameFriendIdSchema = z.string().brand('DbGameFriendId');
// // export type DbGameFriendId = z.infer<typeof DbGameFriendIdSchema>;

// export const DbGameFriendIdSchema = createRawBrandedIdSchema('DbGameFriendId');
// export type DbGameFriendId = z.infer<typeof DbGameFriendIdSchema>;

export type DbGameLobbyId = z.infer<typeof GameLobbyId.idSchema>;
export type DbGameFriendId = z.infer<typeof GameFriendId.idSchema>;
export type DbPlayerProfileId = z.infer<typeof PlayerProfileId.idSchema>;
