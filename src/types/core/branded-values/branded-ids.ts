import { z } from "zod";




// // const playerIdRegex = /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// /**
//  * A globally unique identifier for a player
//  * Format: 'player_' followed by a UUID v4
//  * Example: player_123e4567-e89b-12d3-a456-426614174000
//  */
// export const BfgPlayerIdSchema = z.string().regex(playerIdRegex).brand('BfgPlayerId');

// export type BfgPlayerId = z.infer<typeof BfgPlayerIdSchema>;

// export function createPlayerId(): BfgPlayerId {
//     const uuid = crypto.randomUUID();
//     const playerId = `player_${uuid}`;
//     return BfgPlayerIdSchema.parse(playerId);
// }

// export function isValidPlayerId(id: string): id is BfgPlayerId {
//     return /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
// }

// game, friend, lobby, 


export type BrandedIdSchema<T extends string> = z.ZodBranded<z.ZodString, T>;

export type BrandedId<T extends string> = z.infer<BrandedIdSchema<T>>;


// export const createBrandedIdSchema = (prefix: string): BrandedIdSchema<string> => {
//   const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);

//   // const uuid = crypto.randomUUID();
//   const retVal = z.string().regex(idRegex).brand(prefix).describe(`bfg-${prefix}`);
//   return retVal;
// }


export const createRawBrandedIdSchema = (prefix: string): BrandedIdSchema<string> => {
  const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);

  const retVal = z.string().regex(idRegex).brand(prefix);
  return retVal;
}

export type RawBrandedIdSchema = ReturnType<typeof createRawBrandedIdSchema>;


export const createBfgBrandedIdMetadata = (prefix: string) => {
  const rawSchema = createRawBrandedIdSchema(prefix);
  
  const bfgBrandedSchema = z.object({
    brandedSchema: rawSchema,
    idPrefix: z.literal(prefix),
  }).brand(prefix);

  return bfgBrandedSchema;
}

export type BfgBrandedIdMetadata = z.infer<ReturnType<typeof createBfgBrandedIdMetadata>>;



// export const createBrandedIdValue = <T extends string>(brandSchema: BfgBrandedIdMetadata): BrandedId<T> => {
//   console.log("createBrandedIdValue", brandSchema);
  
//   const uuid = crypto.randomUUID();
//   const idPrefix = brandSchema.idPrefix;
//   const retVal = `${idPrefix}_${uuid}`;

//   return retVal as BrandedId<T>;
// }


export const createBrandedIdValue = <T extends string>(idPrefix: string): BrandedId<T> => {
  // console.log("createBrandedIdValue", brandSchema);
  
  const uuid = crypto.randomUUID();
  // const idPrefix = brandSchema.idPrefix;
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


// export const GameFriendIdRegex = /^friend_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;