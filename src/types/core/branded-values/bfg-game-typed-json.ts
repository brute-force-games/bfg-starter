import z from "zod";
import { BfgGameDataJsonType, BfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";


export type BfgGameTypedJsonSchema<T extends BfgSupportedGameTitle> = z.ZodBranded<z.ZodString, T>;

export type BfgGameTypedJson<T extends BfgSupportedGameTitle> = z.infer<BfgGameTypedJsonSchema<T>>;


export interface IBfgGameTypedJson<T, Tname extends BfgSupportedGameTitle> {
  bfgGameTitle: BfgSupportedGameTitle;
  bfgGameDataJsonType: BfgGameDataJsonType;

  createJson: (obj: T) => BfgGameTypedJson<Tname>;
  parseJson: (json: BfgGameTypedJson<Tname>) => T;

  getBrandedSchema: () => BfgGameTypedJson<Tname>;
  jsonSchema: z.ZodSchema<T>;
}


export const createBfgGameTypedJsonMetadata = <T, Tname extends BfgSupportedGameTitle>(
  gameTitle: Tname,
  gameJsonType: BfgGameDataJsonType,
  jsonSchema: z.ZodSchema,
): IBfgGameTypedJson<T, Tname> => {
  
  const createBfgGameTypedJsonValue = (obj: T): BfgGameTypedJson<Tname> => {
    const json = JSON.stringify(obj);
    return json as BfgGameTypedJson<Tname>;
  }

  const metadata: IBfgGameTypedJson<T, Tname> = {
    bfgGameTitle: gameTitle,
    bfgGameDataJsonType: gameJsonType,
    
    createJson: (obj: T) => createBfgGameTypedJsonValue(obj),
    parseJson: (json: BfgGameTypedJson<Tname>) => jsonSchema.parse(json) as T,

    getBrandedSchema: () => createBfgGameTypedJsonValue({} as T),
    jsonSchema,
  } as const;


  return metadata;
}

export type BfgGameTypedJsonMetadata = ReturnType<typeof createBfgGameTypedJsonMetadata>;
  