import { z } from "zod";
import { BfgGameTableActionId } from "../branded-values/bfg-branded-ids";
import { BfgGameTableId } from "../branded-values/bfg-branded-ids";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { createGameSpecificActionJsonSchema } from "../branded-values/bfg-game-state-typed-json";
import { createGameSpecificGameStateJsonSchema } from "../branded-values/bfg-game-state-typed-json";



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
  'game-table-action-host-setup-board',
  'game-table-action-host-event',

  'game-table-action-player-move',
  
  'game-table-action-host-declares-winner',
  'game-table-action-host-declares-draw',
  'game-table-action-host-eliminates-player',
  'game-table-action-host-ends-game',
]);

export type GameTableActionType = z.infer<typeof GameTableActionTypeSchema>;


export const createNewGameTableActionSchema = (gameTitle: AbfgSupportedGameTitle) => {

  const actionJsonSchema = createGameSpecificActionJsonSchema(gameTitle);
  const gameStateJsonSchema = createGameSpecificGameStateJsonSchema(gameTitle);

  const retVal = z.object({
    source: GameTableActionSourceSchema,
    actionType: GameTableActionTypeSchema,
    actionJson: actionJsonSchema,
    actionOutcomeGameStateJson: gameStateJsonSchema,
    createdAt: z.date(),
  });

  return retVal;
}

export type NewGameTableAction = z.infer<ReturnType<typeof createNewGameTableActionSchema>>;


export const createDbGameTableActionSchema = (gameTitle: AbfgSupportedGameTitle) => {
  const newGameTableActionSchema = createNewGameTableActionSchema(gameTitle);

  const retVal = newGameTableActionSchema.extend({
    id: BfgGameTableActionId.idSchema,

    gameTableId: BfgGameTableId.idSchema,
    previousActionId: BfgGameTableActionId.idSchema.nullable(),

    realmId: z.string().optional(),
  });

  return retVal;
}

export type DbGameTableAction = z.infer<ReturnType<typeof createDbGameTableActionSchema>>;  


export type BfgGameSpecificTableAction<TA> = {
  gameTableActionId: z.infer<typeof BfgGameTableActionId.idSchema>,
  source: z.infer<typeof GameTableActionSourceSchema>,
  actionType: z.infer<typeof GameTableActionTypeSchema>,

  gameSpecificAction: TA;
}
