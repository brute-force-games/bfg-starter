import { z } from "zod";


export type BrandedJsonSchema<T extends string> = z.ZodBranded<z.ZodString, T>;

export type BrandedJson<T extends string> = z.infer<BrandedJsonSchema<T>>;


export interface IBfgBrandedJson<T extends string> {
  createId: () => BrandedJson<T>;
  parseId: (id: string) => BrandedJson<T>;

  jsonSchema: BrandedJsonSchema<T>;
}


export const createBrandedJsonSchema = <T extends string>(brandSchema: BrandedJsonSchema<T>): BrandedJsonSchema<T> => {

  const retVal = z.string().brand(brandSchema.description + 'Json');
  return retVal;
}
