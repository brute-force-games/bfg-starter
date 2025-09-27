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


  // const jsonString = JSON.stringify(state);
  // return jsonString as BrandedJson<T>;

  // const retVal = brandSchema.parse(json);
  // return retVal;
  // const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
  // const uuid = crypto.randomUUID();
  // const id = `${brandSchema}_${uuid}`;
  // const json = JSON.stringify(state);
  // const retVal = brandSchema.parse(id);
  // return retVal;
}
