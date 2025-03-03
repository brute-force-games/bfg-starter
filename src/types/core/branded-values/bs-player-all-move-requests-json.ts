// import { z } from "zod";
// import { PlayerMoveRequest, PlayerMoveRequestSchema } from "../../player/player-move-requests";


// export const PlayerMoveRequestJsonSchema = z.string().brand('PlayerMoveRequestJson');

// export type PlayerMoveRequestJson = z.infer<typeof PlayerMoveRequestJsonSchema>;


// export const createPlayerMoveRequestJson = (moveRequest: PlayerMoveRequest): PlayerMoveRequestJson => {
//   const json = JSON.stringify(moveRequest);
//   return json as PlayerMoveRequestJson;
// }

// export const parsePlayerMoveRequestJson = (json: PlayerMoveRequestJson): PlayerMoveRequest | null => {
//   console.log("parsePlayerMoveRequestJson", json, "xxx");
//   const jsobObject = JSON.parse(json);
//   const parseResult = PlayerMoveRequestSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PlayerMoveRequestJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
