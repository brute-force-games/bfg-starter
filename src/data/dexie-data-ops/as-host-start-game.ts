import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { z } from "zod";
import { GameTableActionResult } from "~/types/core/game-table/table-phase";

export const asHostStartGame = async (tableId: DbGameTableId, hostPlayerId: DbPlayerProfileId) => {
  console.log("DB: asHostStartGame", tableId);
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  if (gameTable.gameHostPlayerProfileId !== hostPlayerId) {
    throw new Error("Player is not the host");
  }

  // const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle] as BfgGameEngineProcessor<
  //   z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameStateJsonSchema"]>,
  //   z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameActionJsonSchema"]>,
  //   typeof gameTable.gameTitle
  // >;

  const gameMetadata = getBfgGameMetadata(gameTable);

  if (!gameMetadata) {
    throw new Error("Game state metadata not found");
  }

  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    // typeof gameTable.gameTitle,
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;

  const initGameAction = gameEngine.createBfgGameSpecificInitialGameTableAction(gameTable);
  const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction);

  const gameSpecificSummary = `Game started`;

  const initialGameState: GameTableActionResult<z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>> = {
    gameSpecificState: initialGameSpecificState,
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificStateSummary: gameSpecificSummary,
  };
  
  // return initialGameState;

  console.log("HOST STARTING GAME - INITIAL GAME STATE", initialGameState);
  // const nextPlayersToAct = gameEngineMetadata.createNextPlayersToAct(initGameAction, initialGameState);

  // console.log("HOST STARTING GAME - NEXT PLAYERS TO ACT", nextPlayersToAct);

  const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState);
  console.log("HOST STARTING GAME - GAME STATE JSON", gameStateJson);
  const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction);
  console.log("HOST STARTING GAME - ACTION JSON", actionJson);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();

  const hostStartsGameAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: "game-table-action-source-host",
    actionType: "game-table-action-host-starts-game",
    // nextPlayersToAct,
    actionJson,
    actionOutcomeGameStateJson: gameStateJson,

    realmId: gameTable.realmId,
  }

  await bfgDb.transaction(
    'rw',
    [bfgDb.gameTables, bfgDb.gameTableActions],
    async () => {

      const updatedGameTable: DbGameTable = {
        ...gameTable,
        tablePhase: "table-phase-game-in-progress",
        latestActionId: startActionId,
      }

      await bfgDb
        .gameTables
        .update(gameTable, updatedGameTable);

      await bfgDb.gameTableActions.add(hostStartsGameAction);
    }
  );
}
