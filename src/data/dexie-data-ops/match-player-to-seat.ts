import { GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTable, GameTableSeat } from "~/types/core/game-table/game-table";


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
