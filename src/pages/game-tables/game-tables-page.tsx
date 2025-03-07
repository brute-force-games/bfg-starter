import { DataPage } from "~/components/data-page/data-page";
import { GameTableDetailsComponent } from "~/components/game-table-details/game-table-details-component";
import { deleteAllPlayerGameTables, useLiveGameTables } from "~/data/bfg-db-game-tables";
import { CreateNewGameTableDialog } from "~/dialogs/create-new-game-table-dialog";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTable, NewGameTable } from "~/types/core/game-table/game-table";
import { initializeGameTable } from "~/data/dexie-data-ops/initialize-game-table";


export const GameTablesPage = () => {

  const whoAmI = useBfgWhoAmIContext();
  const allGameTables = useLiveGameTables();

  const playerId = whoAmI.playerId;

  if (!playerId) {
    return <div>No player id found</div>;
  }

  if (!allGameTables) {
    return <div>No game tables found</div>;
  }

  console.log("GameTablesPage: allGameTables", allGameTables);

  const orderedGameTables = allGameTables.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });


  const onDeleteAllData = async () => {
    await deleteAllPlayerGameTables(playerId);
  }

  const onNewDataItemCreated = async (gameTableParameters: NewGameTable) => {
    console.log("MyPlayerProfilesPage: onNewDataItemCreated");

    await initializeGameTable(gameTableParameters);


    // const selectedGameTitle = AvailableGameTitles
    //   .find((title) => title === gameTableParameters.gameTitle);

    // if (!selectedGameTitle) {
    //   throw new Error("Game title is required");
    // }

    // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle];

    // const initialGameState = selectedGameProcessor.createInitialGameState(gameTableParameters);

    // const initialGameTableAction = selectedGameProcessor.createInitialGameTableAction(gameTableParameters);

    // const initialGameTableActionJson = selectedGameProcessor.createJson(initialGameTableAction);

    
    // await addNewGameTable(gameTableParameters);
  }


  const allDetailsComponents = allGameTables?.map((gameTable) => (
    <GameTableDetailsComponent
      key={gameTable.id}
      gameTable={gameTable}
    />
  ))

  return (
    <>
      <DataPage<NewGameTable, DbGameTable>
        itemName="Game Tables"
        allDataItems={orderedGameTables}
        allDataComponents={allDetailsComponents}
        addNewDialogComponent={CreateNewGameTableDialog}
        onNewDataItemCreated={onNewDataItemCreated}
        onDeleteAllData={onDeleteAllData}
      />
    </>
  )
}
