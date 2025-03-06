import { z } from "zod";
import { AllGamesOnShelfSchema, AvailableGameTitlesSchema } from "../../enums/game-shelf";
import { BfgPlayerProfileId } from "../branded-values/bfg-branded-ids";


export const LobbyStatusInvalid = "lobby-status-invalid" as const;
export const LobbyStatusValid = "lobby-status-valid" as const;
export const LobbyStatusAllPlayersReady = "lobby-status-all-players-ready" as const;
export const LobbyStatusComplete = "lobby-status-complete" as const;


export const LobbyStatusEnumSchema = z.enum([
  LobbyStatusInvalid,
  LobbyStatusValid,
  LobbyStatusAllPlayersReady,
  LobbyStatusComplete,
]);

export type LobbyStatusEnum = z.infer<typeof LobbyStatusEnumSchema>;


export const NewGameLobbyParametersSchema = z.object({
  gameOnShelf: AllGamesOnShelfSchema,

  lobbyMinNumPlayers: z.coerce.number().int().positive().min(1, "Minimum number of players must be at least 1").refine(
    (val) => val > 0,
    "Minimum number of players must be greater than 0"
  ),
  lobbyMaxNumPlayers: z.coerce.number().int().positive().min(2).max(6),

  gameHostPlayerId: BfgPlayerProfileId.idSchema,
})

export type NewGameLobbyParameters = z.infer<typeof NewGameLobbyParametersSchema>;


export const ValidatedCreateGameLobbyParametersSchema = NewGameLobbyParametersSchema.superRefine((data, ctx) => {
  if (data.lobbyMinNumPlayers > data.lobbyMaxNumPlayers) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Minimum number of players must be less than or equal to maximum number of players",
      path: ["lobbyMinNumPlayers"],
    });
  }
});

export type ValidatedCreateGameLobbyParameters = z.infer<typeof ValidatedCreateGameLobbyParametersSchema>;


export const AnyGameLobbySchema = NewGameLobbyParametersSchema.extend({
  status: LobbyStatusEnumSchema,
  gameTitle: AvailableGameTitlesSchema,
  lobbyMinNumPlayers: z.coerce.number().int().positive().min(1, "Minimum number of players must be at least 1").refine(
    (val) => val > 0,
    "Minimum number of players must be greater than 0"
  ),
  lobbyMaxNumPlayers: z.coerce.number().int().positive().min(2).max(6),

});

export type AnyGameLobbyStatus = z.infer<typeof AnyGameLobbySchema>;


const InvalidLobbySchema = AnyGameLobbySchema.extend({
  status: z.literal("lobby-status-invalid"),
});

export type InvalidLobbyStatus = z.infer<typeof InvalidLobbySchema>;


const ValidLobbySchema = InvalidLobbySchema.extend({
  status: z.literal("lobby-status-valid"),
});

export type ValidLobbyStatus = z.infer<typeof ValidLobbySchema>;


const AllPlayersReadyLobbySchema = ValidLobbySchema.extend({
  status: z.literal("lobby-status-all-players-ready"),
});

export type AllPlayersReadyLobbyStatus = z.infer<typeof AllPlayersReadyLobbySchema>;


const GameInProgressLobbySchema = AllPlayersReadyLobbySchema.extend({
  status: z.literal("lobby-status-game-in-progress"),
});

export type GameInProgressLobbyStatus = z.infer<typeof GameInProgressLobbySchema>;


const GameCompleteLobbySchema = GameInProgressLobbySchema.extend({
  status: z.literal("lobby-status-game-complete"),
});

export type GameCompleteLobbyStatus = z.infer<typeof GameCompleteLobbySchema>;


const GameAbandonedLobbySchema = GameInProgressLobbySchema.extend({
  status: z.literal("lobby-status-game-abandoned"),
});

export type GameAbandonedLobbyStatus = z.infer<typeof GameAbandonedLobbySchema>;



export const GameLobbySchema = z.discriminatedUnion("status", [
  InvalidLobbySchema,
  ValidLobbySchema,
  AllPlayersReadyLobbySchema,
  GameInProgressLobbySchema,
  GameCompleteLobbySchema,
  GameAbandonedLobbySchema,
]);

export type GameLobby = z.infer<typeof GameLobbySchema>;

