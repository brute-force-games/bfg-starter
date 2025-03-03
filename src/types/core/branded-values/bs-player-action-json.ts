// import { z } from "zod";
// import { PlayerActionSchema, PlayerAction } from "../../player/player-action";
// import { createBrandedJsonSchema } from "./bs-json-string-utils";


// export const BlahJsonSchema = z.string().brand('BlahJson');
// // export const PlayerActionJsonSchema = z.string().brand(PlayerActionSchema.description + 'Json');

// // export type PlayerActionJson = z.infer<typeof PlayerActionJsonSchema>;

// export const PlayerActionJsonSchema = createBrandedJsonSchema(PlayerActionSchema);
// export type PlayerActionJson = z.infer<typeof PlayerActionJsonSchema>;

// // const s: PlayerActionJson = "{}" as PlayerActionJson;


// export const createPlayerActionJson = (action: PlayerAction): PlayerActionJson => {
//   // const json = JSON.stringify(action);
//   // return json as PlayerActionJson;
//   const parseResult = PlayerActionSchema.safeParse(action);
//   if (!parseResult.success) {
//     throw new Error(`Failed to parse PlayerAction: ${parseResult.error}`);
//   }
//   const retVal = JSON.stringify(parseResult.data);
//   return retVal as PlayerActionJson;
// }

// export const parsePlayerActionJson = (json: PlayerActionJson): PlayerAction | null => {
//   const jsonObject = JSON.parse(json);
//   const parseResult = PlayerActionSchema.safeParse(jsonObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse GameStateJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
