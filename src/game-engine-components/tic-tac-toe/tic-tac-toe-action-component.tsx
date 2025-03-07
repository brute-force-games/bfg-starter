import { BasicGameTableActionComponent } from "~/components/games/basic-game-table-action-component";
import { getPlayerSeatForActionSource, isActionForMyPlayer } from "~/data/dexie-data-ops/player-seat-utils";
import { GameTableSeat } from "~/types/core/game-table/game-table";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameEngineMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { TicTacToeGameAction } from "~/types/bfg-game-engines/tic-tac-toe-engine";
import { BfgGameTypedJson } from "~/types/core/branded-values/bfg-game-typed-json";


interface ITicTacToeActionComponentProps {
  myPlayerSeat: GameTableSeat;
  gameTable: DbGameTable;
  action: DbGameTableAction;
}


export const TicTacToeActionComponent = (props: ITicTacToeActionComponentProps) => {
  const { myPlayerSeat, gameTable, action } = props;

  if (action.actionType === 'game-table-action-host-starts-game') {
    return (
      <div>Host Starts Game</div>
    )
  }

  if (action.actionType === 'game-table-action-host-starts-lobby') {
    return (
      <div>Host Starts Lobby</div>
    )
  }

  if (action.actionType === 'game-table-action-host-event') {
    return (
      <div>Host Event: {action.actionJson}</div>
    )
  }

  const actionPlayerSeat = getPlayerSeatForActionSource(action.source);
  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  const actionPlayerLabel = actionPlayerSeat === 'p1' ? 'X' : 'O';
  
  const actionMoveJson = action.actionJson as BfgGameTypedJson<typeof gameTable.gameTitle>;
  const parsedMove = gameEngineMetadata.parseGameActionJson(actionMoveJson);

  const getActionMoveText = (action: TicTacToeGameAction) => {
    if (action.actionType === 'game-table-action-player-move') {
      return action.moveCell;
    }
    return '';
  }
  const actionMoveText = parsedMove.actionType === 'game-table-action-player-move' 
    ? getActionMoveText(parsedMove)
    : '';

  if (action.actionType === 'game-table-action-player-move') {
    const playerId = gameTable[myPlayerSeat] as DbPlayerProfileId;
    const isMyMove = isActionForMyPlayer(action.source, playerId, gameTable);

    if (isMyMove) {
      return (
        <>
          <div>My Move as {actionPlayerLabel} - {actionMoveText}</div>
        </>
      )
    }

    return (
      <div>Other Player Move as {actionPlayerLabel} - {actionMoveText}</div>
    )

  }

  return (
    <BasicGameTableActionComponent
      gameTable={gameTable}
      action={action}
    />
  )
}
