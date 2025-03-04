import { BrandedId, BrandedIdSchema, createBrandedIdValue, createRawBrandedIdSchema } from "./branded-ids";


interface IBfgBrandedId {
  createId: (prefix: string) => BrandedId<string>;
  parseId: (id: string) => BrandedId<string>;

  idSchema: BrandedIdSchema<string>;
}


export type _BfgBrandedIds = {
  GameFriendId: IBfgBrandedId,
  GameLobbyId: IBfgBrandedId,
  GamePlayerId: IBfgBrandedId,
};


export type BfgBrandedId = keyof _BfgBrandedIds;


const GameFriendIdPrefix = "bfg_game_friend" as const;
const GameFriendIdSchema = createRawBrandedIdSchema(GameFriendIdPrefix);

export const GameFriendId = {
  createId: () => createBrandedIdValue(GameFriendIdPrefix),
  parseId: (id: string) => GameFriendIdSchema.parse(id),
  idSchema: GameFriendIdSchema,
} as const;


const GameLobbyIdPrefix = "bfg_game_lobby" as const;
const GameLobbyIdSchema = createRawBrandedIdSchema(GameLobbyIdPrefix);

export const GameLobbyId = {
  createId: () => createBrandedIdValue(GameLobbyIdPrefix),
  parseId: (id: string) => GameLobbyIdSchema.parse(id),
  idSchema: GameLobbyIdSchema,
} as const;


const GamePlayerIdPrefix = "bfg_game_player" as const;
const GamePlayerIdSchema = createRawBrandedIdSchema(GamePlayerIdPrefix);

export const GamePlayerId = {
  createId: () => createBrandedIdValue(GamePlayerIdPrefix),
  parseId: (id: string) => GamePlayerIdSchema.parse(id),
  idSchema: GamePlayerIdSchema,
} as const;



export const BfgBrandedIds: _BfgBrandedIds = {
  GameFriendId: GameFriendId,
  GameLobbyId: GameLobbyId,
  GamePlayerId: GamePlayerId,
} as const;


export const createBfgBrandedId = (id: BfgBrandedId) => {
  return BfgBrandedIds[id];
}
