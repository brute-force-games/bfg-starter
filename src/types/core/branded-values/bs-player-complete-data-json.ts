// import { z } from "zod";
// import { CompletePlayerData, CompletePlayerDataSchema } from "../../player/complete-player-data";


// export const CompletePlayerDataJsonSchema = z.string().brand('CompletePlayerDataJson');

// export type CompletePlayerDataJson = z.infer<typeof CompletePlayerDataJsonSchema>;


// export const createCompletePlayerDataJson = (player: CompletePlayerData): CompletePlayerDataJson => {
//   const json = JSON.stringify(player);
//   return json as CompletePlayerDataJson;
// }

// export const parseCompletePlayerDataJson = (json: CompletePlayerDataJson): CompletePlayerData | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = CompletePlayerDataSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse CompletePlayerDataJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
