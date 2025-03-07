import { GameTableActionSource } from "~/types/core/game-table/game-table-action";
import { DbGameTable, GameTableSeat } from "~/types/core/game-table/game-table";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";


export const getPlayerActionSource = (
  gameTable: DbGameTable,
  playerId: DbPlayerProfileId
): GameTableActionSource => {

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


export const getPlayerSeatForActionSource = (actionSource: GameTableActionSource): GameTableSeat => {
  switch (actionSource) {
    case `game-table-action-source-player-p1`:
      return 'p1';
    case `game-table-action-source-player-p2`:
      return 'p2';
    case `game-table-action-source-player-p3`:
      return 'p3';
    case `game-table-action-source-player-p4`:
      return 'p4';
    case `game-table-action-source-player-p5`:
      return 'p5';
    case `game-table-action-source-player-p6`:
      return 'p6';
    case `game-table-action-source-player-p7`:
      return 'p7';
    case `game-table-action-source-player-p8`:
      return 'p8';
    default:
      throw new Error(`Invalid action source: ${actionSource}`);
  }
}


export const isActionForMyPlayer = (actionSource: GameTableActionSource, playerId: DbPlayerProfileId, gameTable: DbGameTable): boolean => {
  switch (actionSource) {
    case `game-table-action-source-player-p1`:
      return playerId === gameTable.p1;
    case `game-table-action-source-player-p2`:
      return playerId === gameTable.p2;
    case `game-table-action-source-player-p3`:
      return playerId === gameTable.p3;
    case `game-table-action-source-player-p4`:
      return playerId === gameTable.p4;
    case `game-table-action-source-player-p5`:
      return playerId === gameTable.p5;
    case `game-table-action-source-player-p6`:
      return playerId === gameTable.p6;
    case `game-table-action-source-player-p7`:
      return playerId === gameTable.p7;
    case `game-table-action-source-player-p8`:
      return playerId === gameTable.p8;
    default:
      return false;
  }
}


export const isPlayerSeatedAtGameTable = (playerId: DbPlayerProfileId, gameTable: DbGameTable): boolean => {
  return gameTable.p1 === playerId ||
    gameTable.p2 === playerId ||
    gameTable.p3 === playerId ||
    gameTable.p4 === playerId ||
    gameTable.p5 === playerId ||
    gameTable.p6 === playerId ||
    gameTable.p7 === playerId ||
    gameTable.p8 === playerId;
}


export const isPlayerAtGameTable = (playerId: GamePlayerId, gameTable: DbGameTable): boolean => {
  return matchPlayerToSeat(playerId, gameTable) !== undefined;
}


export const matchPlayerToSeat = (playerId: GamePlayerId, gameTable: DbGameTable): GameTableSeat | undefined => {
  if (gameTable.p1 === playerId) {
    return 'p1';
  }
  if (gameTable.p2 === playerId) {
    return 'p2';
  }
  if (gameTable.p3 === playerId) {
    return 'p3';
  }
  if (gameTable.p4 === playerId) {
    return 'p4';
  }
  if (gameTable.p5 === playerId) {
    return 'p5';
  }
  if (gameTable.p6 === playerId) {
    return 'p6';
  }
  if (gameTable.p7 === playerId) {
    return 'p7';
  }
  if (gameTable.p8 === playerId) {
    return 'p8';
  }
  return undefined;
}
