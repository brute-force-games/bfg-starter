import z from "zod";
import { AbfgSupportedGameTitle, AbfgSupportedGameJsonType } from "~/types/bfg-game-engines/supported-games";


export const createGameSpecificGameStateJsonSchema = (gameTitle: AbfgSupportedGameTitle) => {
  return z.string().brand(gameTitle).brand('game-state');
}

export const createGameSpecificActionJsonSchema = (gameTitle: AbfgSupportedGameTitle) => {
  return z.string().brand(gameTitle).brand('game-action');
}


export type BfgGameSpecificGameStateJsonString = {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: 'game-state';
  jsonString: z.infer<ReturnType<typeof createGameSpecificGameStateJsonSchema>>;
}


export type BfgGameSpecificActionJsonString = {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: 'game-action';
  jsonString: z.infer<ReturnType<typeof createGameSpecificActionJsonSchema>>;
}


export interface IBfgGameTypedJson<T extends z.ZodTypeAny> {
  bfgGameTitle: AbfgSupportedGameTitle;
  bfgGameDataJsonType: AbfgSupportedGameJsonType;

  createGameAndTypeSpecificJsonString: (obj: z.infer<T>) => BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString;
  parseGameAndTypeSpecificJsonString: (gameTypeJson: BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString) => z.infer<T>;

  jsonSchema: z.ZodSchema<T>;
}


export const createBfgGameTypedJsonMetadata = <T extends z.ZodTypeAny>(
  gameTitle: AbfgSupportedGameTitle,
  gameJsonType: AbfgSupportedGameJsonType,
  jsonSchema: z.ZodTypeAny,
): IBfgGameTypedJson<T> => {
  
  const createBfgGameTypedJsonString = (obj: T): BfgGameSpecificGameStateJsonString | BfgGameSpecificActionJsonString => {
    const json = JSON.stringify(obj);
    
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

    jsonSchema,
  } as const;


  return metadata;
}

export type BfgGameTypedJsonMetadata = ReturnType<typeof createBfgGameTypedJsonMetadata>;
  