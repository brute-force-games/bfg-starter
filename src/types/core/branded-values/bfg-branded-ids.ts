import { BrandedId, createBfgBrandedIdMetadata, IBfgBrandedId } from "./branded-ids";


export type _BfgBrandedIds = {
  GameFriendId: IBfgBrandedId<"GameFriendId">,
  GameLobbyId: IBfgBrandedId<"GameLobbyId">,
  GamePlayerId: IBfgBrandedId<"GamePlayerId">,
  PlayerProfileId: IBfgBrandedId<"PlayerProfileId">,
  GameMoveId: IBfgBrandedId<"GameMoveId">,
};


export type BfgBrandedId = keyof _BfgBrandedIds;


const GameFriendIdPrefix = "bfg_game_friend" as const;
const GameLobbyIdPrefix = "bfg_game_lobby" as const;
const GamePlayerIdPrefix = "bfg_game_player" as const;
const PlayerProfileIdPrefix = "bfg_player_profile" as const;
const GameMoveIdPrefix = "bfg_game_move" as const;
const CommMessageChannelIdPrefix = "bfg_comm_message_channel" as const;
const GameTableIdPrefix = "bfg_game_table" as const;
const GameTableActionIdPrefix = "bfg_game_table_action" as const;


export const BfgAppKeyValueId = createBfgBrandedIdMetadata("bfg_app_kv" as const);
export const BfgGameFriendId = createBfgBrandedIdMetadata(GameFriendIdPrefix);
export const BfgGamePlayerId = createBfgBrandedIdMetadata(GamePlayerIdPrefix);
export const BfgPlayerProfileId = createBfgBrandedIdMetadata(PlayerProfileIdPrefix);
export const BfgGameLobbyId = createBfgBrandedIdMetadata(GameLobbyIdPrefix);
export const BfgGameMoveId = createBfgBrandedIdMetadata(GameMoveIdPrefix);
export const BfgCommMessageChannelId = createBfgBrandedIdMetadata(CommMessageChannelIdPrefix);
export const BfgGameTableId = createBfgBrandedIdMetadata(GameTableIdPrefix);
export const BfgGameTableActionId = createBfgBrandedIdMetadata(GameTableActionIdPrefix);


export type AppKeyValueId = typeof BfgAppKeyValueId;
export type GameFriendId = typeof BfgGameFriendId;
// export type GamePlayerId = typeof BfgGamePlayerId;
// export type PlayerProfileId = typeof BfgPlayerProfileId;
export type GameLobbyId = typeof BfgGameLobbyId;
export type GameMoveId = typeof BfgGameMoveId;



export type GamePlayerId = BrandedId<typeof GamePlayerIdPrefix>;
export type PlayerProfileId = BrandedId<typeof PlayerProfileIdPrefix>;
export type CommMessageChannelId = BrandedId<typeof CommMessageChannelIdPrefix>;
export type GameTableId = BrandedId<typeof GameTableIdPrefix>;
export type GameTableActionId = BrandedId<typeof GameTableActionIdPrefix>;


export const BfgBrandedIds: _BfgBrandedIds = {
  GameFriendId: BfgGameFriendId,
  GameLobbyId: BfgGameLobbyId,
  GamePlayerId: BfgGamePlayerId,
  PlayerProfileId: BfgPlayerProfileId,
  GameMoveId: BfgGameMoveId,
} as const;


export const createBfgBrandedId = (id: BfgBrandedId) => {
  return BfgBrandedIds[id];
}
