// import { z } from "zod";
// import { CompleteGameStateSchema } from "./complete-game-state";
// import { PvjPlayerMoveRequestSchema } from "../player/player-move-requests";
// import { GameMoveIndex } from "./branded-values/bs-game-move-index";
// import { PublishedMoveResultJson } from "./branded-values/bs-published-move-result-json";
// import { JsonValueContainer } from "./branded-values/bs-json-value";
// import { PvjAllPlayerMoveOptionsSchema } from "../player/player-move-options";


// export const MoveResultSchema = z.object({
//   sourceMoveRequest: PvjPlayerMoveRequestSchema,
//   completeGameState: CompleteGameStateSchema,
//   resultingPlayerMoveOptions: PvjAllPlayerMoveOptionsSchema,
// });

// export type MoveResult = z.infer<typeof MoveResultSchema>;



// export const PublishedMoveResultSchema = z.object({
//   sourceMoveRequest: PvjPlayerMoveRequestSchema,
//   resultingPlayerMoveOptions: PvjAllPlayerMoveOptionsSchema,
// });

// export type PublishedMoveResult = z.infer<typeof PublishedMoveResultSchema>;


// export type AllPublishedMoveResultsJson = { [key: GameMoveIndex]: JsonValueContainer<PublishedMoveResultJson> };
