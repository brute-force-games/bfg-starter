

// export const PlayerMoveOptionsJsonSchema = z.string().brand('PlayerMoveOptionsJson');

// export type PlayerMoveOptionsJson = z.infer<typeof PlayerMoveOptionsJsonSchema>;


// export const createPlayerMoveOptionsJson = (moveOptions: PlayerMoveOptions): PlayerMoveOptionsJson => {
//   const json = JSON.stringify(moveOptions);
//   console.log("CHECKME createPlayerMoveOptionsJson", moveOptions, json, "xxx");
//   return json as PlayerMoveOptionsJson;
// }

// export const parsePlayerMoveOptionsJson = (json: PlayerMoveOptionsJson): PlayerMoveOptions | null => {
//   console.log("parsePlayerMoveOptionsJson", json, "xxx");
//   const jsobObject = JSON.parse(json);
//   const parseResult = PlayerMoveOptionsSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse PlayerMoveOptionsJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
