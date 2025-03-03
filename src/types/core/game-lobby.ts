// import { z } from "zod";
// import { GameOnShelfSchema } from "../enums/game-shelf";
// import { PlayerIdSchema } from "./branded-values/bs-player-id";
// import { PlayerInLobbySchema } from "./player/player";

import { z } from "zod";
import { PlayerIdSchema } from "./branded-values/bs-player-id";
import { GameOnShelfSchema } from "../enums/game-shelf";
import { PlayerInLobbySchema } from "./player/player";


export const CreateGameLobbyParametersSchema = z.object({
  // name: z.string().min(3, "Name must be at least 3 characters"),
  // maxNumPlayers: z.number().min(2).max(6),
  gameOnShelf: GameOnShelfSchema,

  // lobbyTbId: LobbyIdSchema,
  // gameTbId: GameIdSchema,
  // randomSeed: z.string(),
});

const NotReadyStatusSchema = z.object({
  started: z.literal(false),
});

const ReadyStatusSchema = z.object({
  started: z.literal(true),
  gameUrl: z.string(),
});

const GameLobbyStatusSchema = z.discriminatedUnion("started", [
  NotReadyStatusSchema,
  ReadyStatusSchema,
]);

export const GameLobbyInProgressSchema = CreateGameLobbyParametersSchema.extend({
  gameHostPlayerId: PlayerIdSchema.nullable(),
  players: z.array(PlayerInLobbySchema),
  status: GameLobbyStatusSchema,
});

export const GameLobbyCompleteSchema = GameLobbyInProgressSchema.extend({
  gameHostPlayerId: PlayerIdSchema,
  status: ReadyStatusSchema,
});



export type CreateGameLobbyParameters = z.infer<typeof CreateGameLobbyParametersSchema>;  
export type GameLobbyInProgress = z.infer<typeof GameLobbyInProgressSchema>;


// export type GameLobbyComplete = z.infer<typeof GameLobbyCompleteSchema>;


// const GameLobbyWaitingSchema = z.object({
//   status: z.literal('waiting'),
// });


// export type GameLobbyWaiting = z.infer<typeof GameLobbyWaitingSchema>;


// export const GameLobbyInProgressSchema = z.object({
//   status: z.literal('lobby-in-progress'),
// });

// export type GameLobbyInProgress = z.infer<typeof GameLobbyInProgressSchema>;


// export const GameLobbyReadySchema = z.object({
//   status: z.literal('lobby-ready'),
// });

// export type GameLobbyReady = z.infer<typeof GameLobbyReadySchema>;


export const GameLobbySchema = z.discriminatedUnion('status', [
  GameLobbyInProgressSchema,
  GameLobbyCompleteSchema,
]);

export type GameLobby = z.infer<typeof GameLobbySchema>;
