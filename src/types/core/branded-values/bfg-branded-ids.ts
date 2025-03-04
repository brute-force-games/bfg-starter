import { createBfgBrandedIdMetadata, IBfgBrandedId } from "./branded-ids";



export type _BfgBrandedIds = {
  GameFriendId: IBfgBrandedId<"GameFriendId">,
  GameLobbyId: IBfgBrandedId<"GameLobbyId">,
  GamePlayerId: IBfgBrandedId<"GamePlayerId">,
};


export type BfgBrandedId = keyof _BfgBrandedIds;


const GameFriendIdPrefix = "bfg_game_friend" as const;
// const GameFriendIdSchema = createRawBrandedIdSchema(GameFriendIdPrefix);

// export const GameFriendId = {
//   createId: () => createBrandedIdValue(GameFriendIdPrefix),
//   parseId: (id: string) => GameFriendIdSchema.parse(id),
//   idSchema: GameFriendIdSchema,
// } as const;


const GameLobbyIdPrefix = "bfg_game_lobby" as const;
// const GameLobbyIdSchema = createRawBrandedIdSchema(GameLobbyIdPrefix);


// export const GameLobbyId = {
//   createId: () => createBrandedIdValue(GameLobbyIdPrefix),
//   // createId: () => createBrandedId(GameLobbyIdMetadata),
//   // createId: () => GameLobbyIdMetadata.createBrandedId(),
//   parseId: (id: string) => GameLobbyIdSchema.parse(id),
//   idSchema: GameLobbyIdSchema,
// } as const;





const GamePlayerIdPrefix = "bfg_game_player" as const;
// const GamePlayerIdSchema = createRawBrandedIdSchema(GamePlayerIdPrefix);

// export const GamePlayerId = {
//   createId: () => createBrandedIdValue(GamePlayerIdPrefix),
//   parseId: (id: string) => GamePlayerIdSchema.parse(id),
//   idSchema: GamePlayerIdSchema,
// } as const;



const PlayerProfileIdPrefix = "bfg_player_profile" as const;


export const GameLobbyId = createBfgBrandedIdMetadata(GameLobbyIdPrefix);
export const GameFriendId = createBfgBrandedIdMetadata(GameFriendIdPrefix);
export const GamePlayerId = createBfgBrandedIdMetadata(GamePlayerIdPrefix);
export const PlayerProfileId = createBfgBrandedIdMetadata(PlayerProfileIdPrefix);



export const BfgBrandedIds: _BfgBrandedIds = {
  GameFriendId,
  GameLobbyId,
  GamePlayerId,
} as const;


export const createBfgBrandedId = (id: BfgBrandedId) => {
  return BfgBrandedIds[id];
}
