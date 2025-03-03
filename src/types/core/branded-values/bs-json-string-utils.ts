import { z } from "zod";


// export const createBrandedJson = <T, U>(state: T): U => {
//   const json = JSON.stringify(state);
//   return json as U;
// }

export const createBrandedJsonSchema = <U extends z.SomeZodObject>(
  schema: U
): z.ZodBranded<z.ZodString, string> => {
  // z.ZodBranded<z.ZodString, "BlahJson">
  const retVal = z.string().brand(schema.description + 'Json');
  return retVal;
}

// export const createBrandedJsonString = <T>(state: T, schema: z.ZodSchema<T>): string => {
//   const json = JSON.stringify(state);
//   const parseResult = schema.safeParse(json);
//   if (!parseResult.success) {
//     throw new Error(`Failed to parse JSON: ${parseResult.error}`);
//   }
//   return parseResult.data as z.infer<typeof schema>;
// }

// export const createBrandedJsonString = <T extends z.SomeZodObject, U extends z.ZodBranded<z.ZodString, string>>(
//   state: T,
//   // schema: U
// ): z.ZodBranded<z.ZodString, string> => {
//   const json = JSON.stringify(state);
//   // type jsonSchemaType = z.infer<typeof createBrandedJsonSchema(schema)>;
//   // const jsonSchemaType = z.infer<typeof jsonSchema>;

//   const retVal = json as z.infer<typeof schema>;
//   return retVal;

//   // const parseResult = schema.safeParse(json);
//   // if (!parseResult.success) {
//   //   throw new Error(`Failed to parse JSON: ${parseResult.error}`);
//   // }
//   // return parseResult.data as z.infer<typeof schema>;
// }


export const createBrandedJson = <T>(state: T, schema: z.ZodSchema<T>): z.infer<typeof schema> => {
  const json = JSON.stringify(state);
  const parseResult = schema.safeParse(json);
  if (!parseResult.success) {
    throw new Error(`Failed to parse JSON: ${parseResult.error}`);
  }
  return parseResult.data as z.infer<typeof schema>;
}


// export const parsePrivateGameStateJson = (json: PrivateGameStateJson): GameState | null => {
//   const jsobObject = JSON.parse(json);
//   const parseResult = GameStateSchema.safeParse(jsobObject);
//   if (!parseResult.success) {
//     console.error(`Failed to parse GameStateJson: ${parseResult.error}`);
//     return null;
//   }
//   return parseResult.data;
// }
