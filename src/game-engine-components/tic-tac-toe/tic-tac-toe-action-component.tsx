import { BasicGameTableActionComponent } from "~/components/games/basic-game-table-action-component";
import { getPlayerSeatForActionSource, isActionForMyPlayer } from "~/data/game-table-ops/player-seat-utils";
import { GameTableSeat } from "~/models/game-table/game-table";
import { DbGameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";


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
  // const gameEngineMetadata = AllBfgGameMetadata[gameTable.gameTitle];

  const actionPlayerLabel = actionPlayerSeat === 'p1' ? 'X' : 'O';
  
  // const actionMoveJson = action.actionJson as BfgGameTypedJson<typeof gameTable.gameTitle>;
  // const parsedMove = gameEngineMetadata.processor.parseGameSpecificActionJson(actionMoveJson);

  // const getActionMoveText = (action: TicTacToeGameAction) => {
  //   if (action.actionType === 'game-table-action-player-move') {
  //     return action.moveCell;
  //   }
  //   return '';
  // }

  // const actionMoveText = action.actionType === 'game-table-action-player-move' 
  //   ? getActionMoveText(parsedMove.gameSpecificAction)
  //   : '';
  // const actionMoveText = getActionMoveText(parsedMove);
  const actionMoveText = "blah";

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
