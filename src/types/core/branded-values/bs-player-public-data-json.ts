// import { z } from "zod";
// import { PublicPlayerData, PublicPlayerDataSchema } from "../../player/public-player-data";


// export const PublicPlayerDataJsonSchema = z.string().brand('PublicPlayerDataJson');

// export type PublicPlayerDataJson = z.infer<typeof PublicPlayerDataJsonSchema>;


// export const createPublicPlayerDataJson = (player: PublicPlayerData): PublicPlayerDataJson => {
//   const json = JSON.stringify(player);
//   return json as PublicPlayerDataJson;
// }

// export const parsePublicPlayerDataJson = (json: PublicPlayerDataJson): PublicPlayerData | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = PublicPlayerDataSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PublicPlayerDataJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
