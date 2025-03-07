import { Link } from "react-router-dom";
import { isPlayerAtGameTable } from "~/data/dexie-data-ops/player-seat-utils";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTable } from "~/types/core/game-table/game-table";


export const GameTablePlayerOptionsComponent = (props: {
  myPlayerId: GamePlayerId;
  gameTable: DbGameTable;
}) => {

  const { myPlayerId, gameTable } = props;

  const gameEngineMetadata = getBfgGameMetadata(gameTable);
  console.log("gameEngineMetadata", gameEngineMetadata);

  // const myPlayerSeat = gameTable.gamePlayers.find(player => player.playerId === myPlayerId);
  const amIAtTable = isPlayerAtGameTable(myPlayerId, gameTable);

  if (gameTable.tablePhase === 'table-phase-lobby') {
    return (
      <>
        <div>Game not started</div>
        <div><Link to={`/game-tables/${gameTable.id}/seat`}>Take Seat</Link></div>
      </>
    );
  }

  if (gameTable.tablePhase === 'table-phase-game-in-progress') {
    if (amIAtTable) {
      return (
        <>
          <div>I am already playing</div>
          <div>
            <Link to={`/game-tables/${gameTable.id}/next-action`}>Next Action</Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>Game in progress</div>
          <div>
            <Link to={`/game-tables/${gameTable.id}/watch`}>Watch Game</Link>
          </div>
        </>
      );
    }
  }

  // const gameEngineProcessor = gameEngineMetadata.gameEngineProcessor;


  // <div><Link to={`/game-tables/${gameTable.id}/seat`}>Take Seat</Link></div>
  // <div><Link to={`/game-tables/${gameTable.id}/actions`}>Game Actions</Link></div>
  // <div><Link to={`/game-tables/${gameTable.id}/next-action`}>Next Action</Link></div>



  return <div>GameTablePlayerOptionsComponent</div>;
};
