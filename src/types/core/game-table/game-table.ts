import { z } from "zod";
import { BfgGameFriendId, BfgGamePlayerId, BfgGameTableActionId, BfgGameTableId } from "../branded-values/bfg-branded-ids";
import { TablePhaseEnumSchema } from "./table-phase";
import { AvailableGameTitlesSchema } from "~/types/enums/game-shelf";


export const GameTableSeatSchema = z.enum([
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
]);

export type GameTableSeat = z.infer<typeof GameTableSeatSchema>;


export const NewGameTableSchema = z.object({
  
  gameTitle: AvailableGameTitlesSchema,
  gameHostPlayerId: BfgGamePlayerId.idSchema,
  tablePhase: TablePhaseEnumSchema,

  sharedWith: z.array(BfgGameFriendId.idSchema),

  p1: BfgGamePlayerId.idSchema,
  p2: BfgGamePlayerId.idSchema.optional(),
  p3: BfgGamePlayerId.idSchema.optional(),
  p4: BfgGamePlayerId.idSchema.optional(),
  p5: BfgGamePlayerId.idSchema.optional(),
  p6: BfgGamePlayerId.idSchema.optional(),
  p7: BfgGamePlayerId.idSchema.optional(),
  p8: BfgGamePlayerId.idSchema.optional(),

  createdAt: z.date(),
});

export type NewGameTable = z.infer<typeof NewGameTableSchema>;


export const DbGameTableSchema = NewGameTableSchema.extend({
  id: BfgGameTableId.idSchema,
  latestActionId: BfgGameTableActionId.idSchema,
  realmId: z.string().optional(),
});

export type DbGameTable = z.infer<typeof DbGameTableSchema>;
