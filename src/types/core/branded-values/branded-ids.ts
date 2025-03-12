import { z } from "zod";


export type BrandedIdSchema<T extends string> = z.ZodBranded<z.ZodString, T>;

export type BrandedId<T extends string> = z.infer<BrandedIdSchema<T>>;


export const createRawBrandedIdSchema = (prefix: string): BrandedIdSchema<string> => {
  const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);

  const retVal = z.string().regex(idRegex).brand(prefix);
  return retVal;
}

export type RawBrandedIdSchema = ReturnType<typeof createRawBrandedIdSchema>;


export interface IBfgBrandedId<T extends string> {
  createId: () => BrandedId<T>;
  parseId: (id: string) => BrandedId<T>;

  idSchema: BrandedIdSchema<T>;
}


export const createBfgBrandedIdMetadata = <T extends string>(prefix: string): IBfgBrandedId<T> => {

  const idPrefix = z.literal(prefix);
  const bfgBrandedSchema = createRawBrandedIdSchema(prefix);

  const metadata: IBfgBrandedId<T> = {
    createId: () => createBrandedIdValue(idPrefix.value),
    parseId: (id: string) => bfgBrandedSchema.parse(id) as BrandedId<T>,
    idSchema: bfgBrandedSchema,
  } as const;

  return metadata;
}

export type BfgBrandedIdMetadata = ReturnType<typeof createBfgBrandedIdMetadata>;


export const createBrandedIdValue = <T extends string>(idPrefix: string): BrandedId<T> => {
  const uuid = crypto.randomUUID();
  const retVal = `${idPrefix}_${uuid}`;

  return retVal as BrandedId<T>;
}


export const parseBrandedIdValueFromSchema = <T extends string>(schema: BrandedIdSchema<T>, id: string): BrandedId<T> => {
  const retVal = schema.parse(id);
  return retVal as BrandedId<T>;
}


export const createBrandedId = <T extends string>(brandSchema: BrandedIdSchema<T>): BrandedId<T> => {

  // const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
  const uuid = crypto.randomUUID();
  const id = `${brandSchema}_${uuid}`;
  const retVal = brandSchema.parse(id);
  return retVal;
}



export const isValidBrandedId = <T extends string>(id: string, prefix: T): id is BrandedId<T> => {
  const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
  return idRegex.test(id);
}

