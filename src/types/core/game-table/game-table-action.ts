import { z } from "zod";
import { BfgGameTableActionId } from "../branded-values/bfg-branded-ids";
import { BfgGameTableId } from "../branded-values/bfg-branded-ids";


export const GameTableActionSourceSchema = z.enum([
  'game-table-action-source-host',

  'game-table-action-source-player-p1',
  'game-table-action-source-player-p2',
  'game-table-action-source-player-p3',
  'game-table-action-source-player-p4',
  'game-table-action-source-player-p5',
  'game-table-action-source-player-p6',
  'game-table-action-source-player-p7',
  'game-table-action-source-player-p8',  
]);

export type GameTableActionSource = z.infer<typeof GameTableActionSourceSchema>;



export const GameTableActionTypeSchema = z.enum([
  'game-table-action-host-starts-lobby',
  'game-table-action-host-starts-game',
  'game-table-action-host-event',

  'game-table-action-player-move',
  
  'game-table-action-host-declares-winner',
  'game-table-action-host-declares-draw',
  'game-table-action-host-eliminates-player',
  'game-table-action-host-ends-game',
]);

export type GameTableActionType = z.infer<typeof GameTableActionTypeSchema>;



export const NewGameTableActionSchema = z.object({
  source: GameTableActionSourceSchema,
  actionType: GameTableActionTypeSchema,
  
  actionJson: z.string(),
  actionOutcomeGameStateJson: z.string(),

  // nextPlayersToAct: z.array(GameTableSeatSchema),

  createdAt: z.date(),
});

export type NewGameTableAction = z.infer<typeof NewGameTableActionSchema>;



export const DbGameTableActionSchema = NewGameTableActionSchema.extend({
  id: BfgGameTableActionId.idSchema,

  gameTableId: BfgGameTableId.idSchema,
  previousActionId: BfgGameTableActionId.idSchema.nullable(),

  realmId: z.string().optional(),
});

export type DbGameTableAction = z.infer<typeof DbGameTableActionSchema>;  


// const BfgGameTableActionTypeSchema = z.object({
//   gameActionType: GameActionTypeSchema,
// });


export type BfgGameSpecificTableAction<TActionId extends z.ZodType, TA extends z.ZodType> = {
  gameTableActionId: z.infer<TActionId>,
  source: z.infer<typeof GameTableActionSourceSchema>,
  actionType: z.infer<typeof GameTableActionTypeSchema>,

  gameSpecificAction: TA;
}


// export const createBfgGameSpecificTableActionSchema = <T extends z.ZodType>(
//   // gameActionTypeId: z.ZodBranded<z.ZodTypeAny, 'game-action-type-id'>,

  
//   gameActionTypeSchema: z.ZodSchema,
// ): BfgGameSpecificTableAction<z.infer<typeof gameActionTypeSchema>> => {

//   // GameTableActionTypeSchema

//   // source: GameTableActionSourceSchema,
//   // actionType: GameTableActionTypeSchema,
  
//   // actionJson: z.string(),
//   // actionOutcomeGameStateJson: z.string(),

//   // // nextPlayersToAct: z.array(GameTableSeatSchema),

//   // createdAt: z.date(),


//   const retVal = z.object({
//     // id: BfgGameTableActionId.idSchema,
//     // source: GameTableActionSourceSchema,
//     // actionType: GameTableActionTypeSchema,
//     actionId: z.infer<T>,
//     source: GameTableActionSourceSchema,
//     actionType: GameTableActionTypeSchema,
  
//     gameActionType: gameActionTypeSchema,
//     // actionJson: z.string(),
//     // actionOutcomeGameStateJson: z.string(),
//   });

//   return retVal;
// }
