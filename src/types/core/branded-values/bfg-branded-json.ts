// import z from "zod";


// export type BrandedJsonSchema<T extends string> = z.ZodBranded<z.ZodString, T>;

// export type BrandedJson<T extends string> = z.infer<BrandedJsonSchema<T>>;


// export interface IBfgBrandedJson<T, Tname extends string> {
//   createJson: (obj: T) => BrandedJson<Tname>;
//   parseJson: (json: BrandedJson<Tname>) => T;

//   jsonSchemaBranded: BrandedJsonSchema<Tname>;
//   jsonSchema: z.ZodSchema<T>;
// }


// export const createBfgBrandedJsonMetadata = <T, Tname extends string>(
//   jsonSchema: z.ZodSchema,
// ): IBfgBrandedJson<T, Tname> => {
  
//   const createBrandedJsonValue = (obj: T): BrandedJson<Tname> => {
//     const json = JSON.stringify(obj);
//     return json as BrandedJson<Tname>;
//   }

//   const metadata: IBfgBrandedJson<T, Tname> = {
//     createJson: (obj: T) => createBrandedJsonValue(obj),
//     parseJson: (json: BrandedJson<Tname>) => jsonSchema.parse(json) as T,

//     jsonSchemaBranded: jsonSchema as BrandedJsonSchema<Tname>,
//     jsonSchema,
//   } as const;


//   return metadata;
// }

// export type BfgBrandedJsonMetadata = ReturnType<typeof createBfgBrandedJsonMetadata>;
  