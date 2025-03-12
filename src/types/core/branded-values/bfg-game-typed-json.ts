import z from "zod";
import { BfgGameDataJsonType } from "~/types/bfg-game-engines/supported-games";


export type BfgGameTypedJsonSchema<TheBfgGameTitle extends string> = z.ZodBranded<z.ZodString, TheBfgGameTitle>;

export type BfgGameTypedJson<TheBfgGameTitle extends string> = z.infer<BfgGameTypedJsonSchema<TheBfgGameTitle>>;


export interface IBfgGameTypedJson<T, TheBfgGameTitle extends string> {
  bfgGameTitle: TheBfgGameTitle;
  bfgGameDataJsonType: BfgGameDataJsonType;

  createJson: (obj: T) => BfgGameTypedJson<TheBfgGameTitle>;
  parseJson: (json: BfgGameTypedJson<TheBfgGameTitle>) => T;

  getBrandedSchema: () => BfgGameTypedJson<TheBfgGameTitle>;
  jsonSchema: z.ZodSchema<T>;
}


export const createBfgGameTypedJsonMetadata = <T, TheBfgGameTitle extends string>(
  gameTitle: TheBfgGameTitle,
  gameJsonType: BfgGameDataJsonType,
  jsonSchema: z.ZodSchema,
): IBfgGameTypedJson<T, TheBfgGameTitle> => {
  
  const createBfgGameTypedJsonValue = (obj: T): BfgGameTypedJson<TheBfgGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameTypedJson<TheBfgGameTitle>;
  }

  const metadata: IBfgGameTypedJson<T, TheBfgGameTitle> = {
    bfgGameTitle: gameTitle,
    bfgGameDataJsonType: gameJsonType,
    
    createJson: (obj: T) => createBfgGameTypedJsonValue(obj),
    parseJson: (json: BfgGameTypedJson<TheBfgGameTitle>) => jsonSchema.parse(json) as T,

    getBrandedSchema: () => createBfgGameTypedJsonValue({} as T),
    jsonSchema,
  } as const;


  return metadata;
}

export type BfgGameTypedJsonMetadata = ReturnType<typeof createBfgGameTypedJsonMetadata>;
  