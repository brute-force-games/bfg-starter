// import { z } from "zod";
// import { CompleteGameState, CompleteGameStateSchema, PublicGameState, PublicGameStateSchema } from "../complete-game-state";


// export const CompleteGameStateJsonSchema = z.string().brand('CompleteGameStateJson');

// export type CompleteGameStateJson = z.infer<typeof CompleteGameStateJsonSchema>;


// export const createCompleteGameStateJson = (state: CompleteGameState): CompleteGameStateJson => {
//   const json = JSON.stringify(state);
//   console.log('createCompleteGameStateJson LENGTH', json.length);
//   return json as CompleteGameStateJson;
// }

// export const parseCompleteGameStateJson = (json: CompleteGameStateJson): CompleteGameState | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = CompleteGameStateSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse CompleteGameStateJson: ${parseResult.error}`);
//     console.error(`CompleteGameStateJson: ${json}`);
//     return null;
//   }
//   return parseResult.data;
// }


// export const PublicGameStateJsonSchema = z.string().brand('PublicGameStateJson');

// export type PublicGameStateJson = z.infer<typeof PublicGameStateJsonSchema>;

// export const createPublicGameStateJson = (state: PublicGameState): PublicGameStateJson => {
//   // const retVal = createBrandedJson<PublicGameStateJson>(state);
//   // return retVal;
//   const json = JSON.stringify(state);
//   console.log('createPublicGameStateJson LENGTH', json.length);
//   return json as PublicGameStateJson;
// }


// export const parsePublicGameStateJson = (json: PublicGameStateJson): PublicGameState | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = PublicGameStateSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PublicGameStateJson: ${parseResult.error}`);
//     console.error(`PublicGameStateJson: ${json}`);
//     return null;
//   }
//   return parseResult.data;
// }
