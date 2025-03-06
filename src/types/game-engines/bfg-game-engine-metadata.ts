import { z } from "zod";
import { NewGameTable } from "../core/game-table/game-table";
import { BrandedJson, BrandedJsonSchema } from "../core/branded-values/bfg-branded-json";
import { createBrandedJsonSchema } from "../core/branded-values/bs-json-string-utils";
import { GameTableSeat } from "../core/game-table/game-table";


export type BfgGameEngineProcessor<GS, GA, Tname extends string> = {
  createInitialGameState: (gameTable: NewGameTable) => GS;  // for tic-tac-toe, this is the empty board
  createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

  createGameStateJson: (obj: GS) => BrandedJson<Tname>;  // this creates the representation of the board as JSON
  parseGameStateJson: (json: BrandedJson<Tname>) => GS;  // this parses the JSON back into the game state

  jsonSchemaBranded: BrandedJsonSchema<Tname>;
  jsonSchema: z.ZodSchema<GS>;
}


export const createBfgGameEngineProcessor = <GS extends z.AnyZodObject, GA extends z.AnyZodObject>(
  gameStateSchema: GS,
  createInitialGameState: (gameTable: NewGameTable) => z.infer<GS>,
  createNextPlayersToAct: (gameState: z.infer<GS>) => GameTableSeat[],
  createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>,

): BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, NonNullable<GS['description']>> => {

  type Tname = NonNullable<GS['description']>;
  type TInfer = z.infer<GS>;

  const createBrandedJsonValue = (obj: TInfer): BrandedJson<Tname> => {
    const json = JSON.stringify(obj);
    return json as BrandedJson<Tname>;
  }

  const jsonSchemaBranded = createBrandedJsonSchema(gameStateSchema);

  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, Tname> = {
    createInitialGameState,
    createNextPlayersToAct,
    createInitialGameTableAction,
    
    createGameStateJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameStateJson: (json: BrandedJson<Tname>) => gameStateSchema.parse(json) as GS,

    jsonSchemaBranded,
    jsonSchema: gameStateSchema,
  } as const;

  return processor;
}
