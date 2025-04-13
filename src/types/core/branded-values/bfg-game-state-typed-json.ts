import z from "zod";
import { BfgGameDataJsonType } from "~/types/bfg-game-engines/supported-games";


export type BfgGameSpecificGameStateTypedJsonSchema<TheBfgGameTitle extends string> = z.ZodBranded<z.ZodString, TheBfgGameTitle>;

export type BfgGameSpecificGameStateTypedJson<TheBfgGameTitle extends string> = z.infer<BfgGameSpecificGameStateTypedJsonSchema<TheBfgGameTitle>>;


export interface IBfgGameTypedJson<T, TheBfgGameTitle extends string> {
  bfgGameTitle: TheBfgGameTitle;
  bfgGameDataJsonType: BfgGameDataJsonType;

  createJson: (obj: T) => BfgGameSpecificGameStateTypedJson<TheBfgGameTitle>;
  parseJson: (json: BfgGameSpecificGameStateTypedJson<TheBfgGameTitle>) => T;

  getBrandedSchema: () => BfgGameSpecificGameStateTypedJson<TheBfgGameTitle>;
  jsonSchema: z.ZodSchema<T>;
}


export const createBfgGameTypedJsonMetadata = <T, TheBfgGameTitle extends string>(
  gameTitle: TheBfgGameTitle,
  gameJsonType: BfgGameDataJsonType,
  jsonSchema: z.ZodSchema,
): IBfgGameTypedJson<T, TheBfgGameTitle> => {
  
  const createBfgGameTypedJsonValue = (obj: T): BfgGameSpecificGameStateTypedJson<TheBfgGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameSpecificGameStateTypedJson<TheBfgGameTitle>;
  }

  const metadata: IBfgGameTypedJson<T, TheBfgGameTitle> = {
    bfgGameTitle: gameTitle,
    bfgGameDataJsonType: gameJsonType,
    
    createJson: (obj: T) => createBfgGameTypedJsonValue(obj),
    parseJson: (json: BfgGameSpecificGameStateTypedJson<TheBfgGameTitle>) => jsonSchema.parse(json) as T,

    getBrandedSchema: () => createBfgGameTypedJsonValue({} as T),
    jsonSchema,
  } as const;


  return metadata;
}

export type BfgGameTypedJsonMetadata = ReturnType<typeof createBfgGameTypedJsonMetadata>;
  