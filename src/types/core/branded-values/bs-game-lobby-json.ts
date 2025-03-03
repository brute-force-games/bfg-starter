// import { z } from "zod";
// import { GameLobbyComplete, GameLobbyCompleteSchema, GameLobbyInProgress, GameLobbyInProgressSchema } from "../game-lobby";


// export const GameLobbyJsonSchema = z.string().brand('GameLobbyJson');

// export type GameLobbyJson = z.infer<typeof GameLobbyJsonSchema>;


// export const createGameLobbyJson = (lobby: GameLobbyInProgress): GameLobbyJson => {
//   const json = JSON.stringify(lobby);
//   return json as GameLobbyJson;
// }

// export const parseGameLobbyJson = (json: GameLobbyJson): GameLobbyInProgress | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = GameLobbyInProgressSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse GameLobbyInProgressJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }


// export const parseCompleteGameLobbyJson = (json: GameLobbyJson): GameLobbyComplete | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = GameLobbyCompleteSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse GameLobbyCompleteJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
