// import { z } from "zod";
// import { PublishedMoveResult, PublishedMoveResultSchema } from "../move-result";


// export const PublishedMoveResultJsonSchema = z.string().brand('PublishedMoveResultJson');

// export type PublishedMoveResultJson = z.infer<typeof PublishedMoveResultJsonSchema>;


// export const createPublishedMoveResultJson = (moveResult: PublishedMoveResult): PublishedMoveResultJson => {
//   const json = JSON.stringify(moveResult);
//   console.log("CHECKME createPublishedMoveResultJson", moveResult, json, "xxx");
//   return json as PublishedMoveResultJson;
// }

// export const parsePublishedMoveResultJson = (json: PublishedMoveResultJson): PublishedMoveResult | null => {
//   console.log("parsePublishedMoveResultJson", json, "xxx");
//   const jsobObject = JSON.parse(json);
//   const parseResult = PublishedMoveResultSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PublishedMoveResultJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
