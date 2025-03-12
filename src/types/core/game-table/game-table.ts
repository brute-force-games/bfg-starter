import { z } from "zod";
import { BfgGameFriendId, BfgGameTableActionId, BfgGameTableId, BfgPlayerProfileId } from "../branded-values/bfg-branded-ids";
import { TablePhaseEnumSchema } from "./table-phase";
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games";


export const PLAYER_SEATS = [
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
] as const;


export const GameTableSeatSchema = z.enum(PLAYER_SEATS);

export type GameTableSeat = z.infer<typeof GameTableSeatSchema>;


export const NewGameTableSchema = z.object({
  
  gameTitle: BfgSupportedGameTitlesSchema,
  gameHostPlayerProfileId: BfgPlayerProfileId.idSchema,
  tablePhase: TablePhaseEnumSchema,

  currentStatusDescription: z.string(),

  sharedWith: z.array(BfgGameFriendId.idSchema),

  p1: BfgPlayerProfileId.idSchema,
  p2: BfgPlayerProfileId.idSchema.optional(),
  p3: BfgPlayerProfileId.idSchema.optional(),
  p4: BfgPlayerProfileId.idSchema.optional(),
  p5: BfgPlayerProfileId.idSchema.optional(),
  p6: BfgPlayerProfileId.idSchema.optional(),
  p7: BfgPlayerProfileId.idSchema.optional(),
  p8: BfgPlayerProfileId.idSchema.optional(),

  createdAt: z.date(),
});

export type NewGameTable = z.infer<typeof NewGameTableSchema>;


export const DbGameTableSchema = NewGameTableSchema.extend({
  id: BfgGameTableId.idSchema,
  latestActionId: BfgGameTableActionId.idSchema,
  realmId: z.string().optional(),
});

export type DbGameTable = z.infer<typeof DbGameTableSchema>;
