// import { z } from "zod";
// import { PlayerDef, PlayerDefSchema } from "../../player/player-def";


// export const PlayerDefJsonSchema = z.string().brand('PlayerDefJson');

// export type PlayerDefJson = z.infer<typeof PlayerDefJsonSchema>;


// export const createPlayerDefJson = (player: PlayerDef): PlayerDefJson => {
//   const json = JSON.stringify(player);
//   return json as PlayerDefJson;
// }

// export const parsePlayerDefJson = (json: PlayerDefJson): PlayerDef | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = PlayerDefSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PlayerDefJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
