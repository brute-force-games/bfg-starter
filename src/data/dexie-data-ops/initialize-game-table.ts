import { NewGameTable, DbGameTable } from "~/types/core/game-table/game-table";
import { bfgDb } from "../bfg-db";
import { getTiedRealmId } from "dexie-cloud-addon";
import { BfgGameTableId, BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { AvailableGameTitles } from "~/types/bfg-game-engines/supported-games";
import { z } from "zod";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";


// TODO: how much of this is necessary vs host starting game?
export const initializeGameTable = async (gameTable: NewGameTable) => {

  const selectedGameTitle = AvailableGameTitles
    .find((title) => title === gameTable.gameTitle);

  if (!selectedGameTitle) {
    throw new Error("Game title is required");
  }

  // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle];


  // const selectedGameProcessor = getBfgGameMetadata(gameTable);
  // const selectedGameEngine = selectedGameProcessor.processor as BfgGameEngineProcessor<
  //   // typeof gameTable.gameTitle,
  //   z.infer<typeof selectedGameProcessor.processor["gameStateJsonSchema"]>,
  //   z.infer<typeof selectedGameProcessor.processor["gameActionJsonSchema"]>
  // >;

  const gameMetadata = getBfgGameMetadata(gameTable);

  const gameProcessor = gameMetadata.processor;
  type GameStateType = z.infer<typeof gameProcessor.gameStateSchema>;
  type GameActionType = z.infer<typeof gameProcessor.gameActionSchema>;


  // type gameSpecificStateType = z.infer<typeof selectedGameProcessor.processor["gameStateJsonSchema"]>;
  // type gameSpecificActionType = z.infer<typeof selectedGameProcessor.processor["gameActionJsonSchema"]>;

  // const selectedGameProcessor = getBfgGameMetadata(gameTable);
  const selectedGameEngine = gameProcessor as BfgGameEngineProcessor<
    GameStateType,
    GameActionType
    >;
  // > & {
  //   createInitialGameState: (initialGameTableAction: gameSpecificActionType) => gameSpecificStateType;
  // };

  // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle] as BfgGameEngineProcessor<
  //   z.infer<typeof BfgGameEngineMetadata[typeof selectedGameTitle]["gameStateJsonSchema"]>,
  //   z.infer<typeof BfgGameEngineMetadata[typeof selectedGameTitle]["gameActionJsonSchema"]>,
  //   // typeof selectedGameTitle,
  //   typeof selectedGameTitle
  // >;


  const initGameAction = selectedGameEngine.createBfgGameSpecificInitialGameTableAction(gameTable);
  const initialGameState = selectedGameEngine.createBfgInitialGameSpecificState(initGameAction);

  const initialGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(initialGameState);
  const actionJson = selectedGameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction);

  
  console.log("actionJson", actionJson);

  const retVal = await bfgDb.transaction(
    'rw',
    [bfgDb.gameTables, bfgDb.gameTableActions, bfgDb.realms],
    async () => {

      const newTableId = BfgGameTableId.createId();
      const newActionId = BfgGameTableActionId.createId();

      // Add or update a realm, tied to the lobby using getTiedRealmId():
      const realmId = getTiedRealmId(newTableId);

      // Create a realm for the shared game table. Use put to not fail if it already exists.
      // (Sync consistency)
      bfgDb.realms.put({
        realmId,
        name: "Game Table  - " + gameTable.gameTitle,
        represents: `A game table for ${gameTable.gameTitle}`,
      });
      
      
      const newAction: DbGameTableAction = {
        ...initGameAction,
        id: newActionId,
        previousActionId: null,
        gameTableId: newTableId,
        realmId,
        createdAt: new Date(),
        source: "game-table-action-source-host",
        actionType: "game-table-action-host-starts-lobby",
        actionJson: actionJson.jsonString,
        actionOutcomeGameStateJson: initialGameStateJson.jsonString,
        // nextPlayersToAct,
      }

      const newTable: DbGameTable = {
        ...gameTable,
        id: newTableId,
        latestActionId: newActionId,
        realmId,
      }

      await bfgDb.gameTables.add(newTable);
      await bfgDb.gameTableActions.add(newAction);

      return newTable;
    }
  );

  console.log("initializeGameTable: retVal", retVal);

  return retVal;
}
