import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction, GameTableActionSource } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { BrandedJson } from "~/types/core/branded-values/bfg-branded-json";
import { getLatestAction } from "./order-game-table-actions";
import { z } from "zod";


export const asPlayerMakeMove = async <T extends z.infer<typeof gameEngineMetadata.gameActionJsonSchema>>(
  tableId: DbGameTableId, 
  playerId: DbPlayerProfileId, 
  playerAction: T
) => {
  console.log("DB: asPlayerMakeMove", tableId, playerId);
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!gameEngineMetadata) {
    throw new Error("Game state metadata not found");
  }

  const getPlayerActionSource = (): GameTableActionSource => {
    if (gameTable.p1 === playerId) {
      return `game-table-action-source-player-p1` as GameTableActionSource;
    }
    if (gameTable.p2 === playerId) {
      return `game-table-action-source-player-p2` as GameTableActionSource;
    }
    if (gameTable.p3 === playerId) {
      return `game-table-action-source-player-p3` as GameTableActionSource;
    }
    if (gameTable.p4 === playerId) {
      return `game-table-action-source-player-p4` as GameTableActionSource;
    }
    if (gameTable.p5 === playerId) {
      return `game-table-action-source-player-p5` as GameTableActionSource;
    }
    if (gameTable.p6 === playerId) {
      return `game-table-action-source-player-p6` as GameTableActionSource;
    }
    if (gameTable.p7 === playerId) {
      return `game-table-action-source-player-p7` as GameTableActionSource;
    }
    if (gameTable.p8 === playerId) {
      return `game-table-action-source-player-p8` as GameTableActionSource;
    }
    
    throw new Error("Player not found");
  }

  const playerActionSource = getPlayerActionSource();
  

  const latestAction = await getLatestAction(tableId);

  const initialGameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BrandedJson<typeof gameTable.gameTitle>);

  const afterActionGameState = gameEngineMetadata.applyGameAction(initialGameState, playerAction);

  const nextPlayersToAct = gameEngineMetadata.createNextPlayersToAct(playerAction, afterActionGameState);

  const playerActionJson = gameEngineMetadata.createGameActionJson(playerAction);
  const actionOutcomeGameStateJson = gameEngineMetadata.createGameStateJson(afterActionGameState);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();

  const hostStartsGameAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: playerActionSource,
    actionType: "game-table-action-player-move",
    nextPlayersToAct,
    actionJson: playerActionJson,
    actionOutcomeGameStateJson,

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
