import { z } from "zod";
import { BfgGameFriendId, BfgGameLobbyId, BfgPlayerProfileId, BfgGameMoveId, BfgCommMessageChannelId, BfgGameTableId } from "./bfg-branded-ids";


export const DexieCloudEmailSchema = z.string().brand('DbkDexieCloudEmail');
export type DexieCloudEmail = z.infer<typeof DexieCloudEmailSchema>;

export const GameTitleSchema = z.string().brand('BfgGameTitle');
export type GameTitle = z.infer<typeof GameTitleSchema>;


export type DbGameLobbyId = z.infer<typeof BfgGameLobbyId.idSchema>;
export type DbGameFriendId = z.infer<typeof BfgGameFriendId.idSchema>;
export type DbPlayerProfileId = z.infer<typeof BfgPlayerProfileId.idSchema>;
export type DbGameMoveId = z.infer<typeof BfgGameMoveId.idSchema>;
export type DbCommMessageChannelId = z.infer<typeof BfgCommMessageChannelId.idSchema>;
export type DbGameTableId = z.infer<typeof BfgGameTableId.idSchema>;
