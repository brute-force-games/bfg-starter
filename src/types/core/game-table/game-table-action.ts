import { z } from "zod";
import { BfgGameTableActionId } from "../branded-values/bfg-branded-ids";
import { BfgGameTableId } from "../branded-values/bfg-branded-ids";
import { GameTableSeatSchema } from "./game-table";


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
  'game-table-action-player-move',
  'game-table-action-host-event',
]);

export type GameTableActionType = z.infer<typeof GameTableActionTypeSchema>;



export const NewGameTableActionSchema = z.object({
  source: GameTableActionSourceSchema,

  actionType: GameTableActionTypeSchema,
  actionJson: z.string(),
  actionOutcomeGameStateJson: z.string(),

  nextPlayersToAct: z.array(GameTableSeatSchema),

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
