import z from "zod";
import { AbfgSupportedGameTitle, AbfgSupportedGameJsonType } from "~/types/bfg-game-engines/supported-games";


// export type BfgGameSpecificGameStateTypedJsonSchema<T extends z.ZodTypeAny> = z.ZodBranded<z.ZodString, T>;

// export type BfgGameSpecificGameStateTypedJson<T extends z.ZodTypeAny> = z.infer<BfgGameSpecificGameStateTypedJsonSchema<T>>;

// export type BfgGameTypedValue<T extends z.ZodTypeAny> = z.infer<T>;


// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const createBrandedGameAndTypeJsonSchema = (gameTitle: AbfgSupportedGameTitle, gameJsonType: AbfgSupportedGameJsonType) => {
//   return z.string().brand(gameTitle).brand(gameJsonType);
// }



export const createGameSpecificGameStateJsonSchema = (gameTitle: AbfgSupportedGameTitle) => {
  // return createBrandedGameAndTypeJsonSchema(gameTitle, 'game-state');
  return z.string().brand(gameTitle).brand('game-state');
}

export const createGameSpecificActionJsonSchema = (gameTitle: AbfgSupportedGameTitle) => {
  // return createBrandedGameAndTypeJsonSchema(gameTitle, 'game-action');
  return z.string().brand(gameTitle).brand('game-action');
}




// export type BfgGameSpecificTypedJsonString = {
//   bfgGameTitle: AbfgSupportedGameTitle;
//   bfgGameDataJsonType: AbfgSupportedGameJsonType;
//   // jsonString: z.infer<z.ZodBranded<z.ZodString, T>>;
//   jsonString: z.infer<ReturnType<typeof createGameSpecificGameStateJsonSchema>>;
// }

export type BfgGameSpecificGameStateJsonString = {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: 'game-state';
  // jsonString: z.infer<z.ZodBranded<z.ZodString, T>>;
  jsonString: z.infer<ReturnType<typeof createGameSpecificGameStateJsonSchema>>;
}

export type BfgGameSpecificActionJsonString = {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: 'game-action';
  // jsonString: z.infer<z.ZodBranded<z.ZodString, T>>;
  jsonString: z.infer<ReturnType<typeof createGameSpecificActionJsonSchema>>;
}


export interface IBfgGameTypedJson<T extends z.ZodTypeAny> {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: AbfgSupportedGameJsonType;

  // const brandedJsonSchema = z.string().brand(gameTitle).brand(gameJsonType);

  // type brandedJsonSchemaType = z.infer<typeof brandedJsonSchema>;


  createGameAndTypeSpecificJsonString: (obj: z.infer<T>) => BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString;
  parseGameAndTypeSpecificJsonString: (gameTypeJson: BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString) => z.infer<T>;

  // getBrandedSchema: () => BfgGameTypedValue<T>;
  jsonSchema: z.ZodSchema<T>;
}


export const createBfgGameTypedJsonMetadata = <T extends z.ZodTypeAny>(
  gameTitle: AbfgSupportedGameTitle,
  gameJsonType: AbfgSupportedGameJsonType,
  jsonSchema: z.ZodTypeAny,
// ): IBfgGameTypedJson<T> => {
) => {

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const brandedJsonSchema = z.string().brand(gameTitle).brand(gameJsonType);
  // const brandedJsonSchema = createBrandedGameAndTypeJsonSchema(gameTitle, gameJsonType);

  // type brandedJsonSchemaType = z.infer<typeof brandedJsonSchema>;

  
  const createBfgGameTypedJsonString = (obj: T): BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString => {
    const json = JSON.stringify(obj);
    // return json as BfgGameSpecificJsonString<T>;
    return {
      bfgGameTitle: gameTitle,
      bfgGameDataJsonType: gameJsonType,
      jsonString: json,
    } as BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString;
  }

  const metadata: IBfgGameTypedJson<T> = {
    bfgGameTitle: gameTitle,
    bfgGameDataJsonType: gameJsonType,
    
    createGameAndTypeSpecificJsonString: (obj: z.infer<typeof jsonSchema>) => createBfgGameTypedJsonString(obj),

    parseGameAndTypeSpecificJsonString: (gameTypeJsonString: BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString) => {
      const json = JSON.parse(gameTypeJsonString.jsonString);
      const retValue = jsonSchema.parse(json) as z.infer<typeof jsonSchema>;
      return retValue;
    },

    // getBrandedSchema: () => createBfgGameTypedValue({} as T),
    jsonSchema,
  } as const;


  return metadata;
}

export type BfgGameTypedJsonMetadata = ReturnType<typeof createBfgGameTypedJsonMetadata>;
  