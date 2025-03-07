import { NewGameTable, DbGameTable } from "~/types/core/game-table/game-table";
import { bfgDb } from "../bfg-db";
import { getTiedRealmId } from "dexie-cloud-addon";
import { BfgGameTableId, BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { AvailableGameTitles } from "~/types/enums/game-shelf";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";


// TODO: how much of this is necessary vs host starting game?
export const initializeGameTable = async (gameTable: NewGameTable) => {

  const selectedGameTitle = AvailableGameTitles
    .find((title) => title === gameTable.gameTitle);

  if (!selectedGameTitle) {
    throw new Error("Game title is required");
  }

  const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle];

  const initGameAction = selectedGameProcessor.createInitialGameTableAction(gameTable);
  const initialGameState = selectedGameProcessor.createInitialGameState(initGameAction);

  const initialGameStateJson = selectedGameProcessor.createGameStateJson(initialGameState);
  const actionJson = selectedGameProcessor.createGameActionJson(initGameAction);

  // const nextPlayersToAct = selectedGameProcessor.createNextPlayersToAct(initialGameTableAction, initialGameState);

  
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
        actionJson: actionJson,
        actionOutcomeGameStateJson: initialGameStateJson,
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
    }
  );

  console.log("initializeGameTable: retVal", retVal);

  return retVal;
}
