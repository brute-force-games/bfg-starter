import { Link, useParams } from "react-router-dom";
import { useLiveGameTable } from "~/data/bfg-db-game-tables";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { TableSeatComponent } from "./table-seat-component";
import { GameTableHostSeatComponent } from "./game-table-host-seat-component";


export const GameTableSeatPage = () => {

  const { gameTableId } = useParams();
  const { defaultPlayerProfileId: playerId } = useBfgWhoAmIContext();

  const gameTable = useLiveGameTable(gameTableId as DbGameTableId);

  if (!gameTable) {
    return <div>Game Table not found</div>;
  }

  if (!playerId) {
    return <div>Player Profile ID not found</div>;
  }
  
  return (
    <div>
      <h2>Table - {gameTable.gameTitle}</h2>
      <h5>{gameTable.createdAt.toLocaleString()}</h5>

      <GameTableHostSeatComponent myPlayerId={playerId} gameTable={gameTable} />

      {
        gameTable.tablePhase === 'table-phase-game-in-progress' && (
          <Link to={`/game-tables/${gameTableId}/next-action`}>Next Action</Link>
        )
      }
      
      <TableSeatComponent myPlayerId={playerId} playerSeat="p1" gameTable={gameTable} />
      <TableSeatComponent myPlayerId={playerId} playerSeat="p2" gameTable={gameTable} />

    </div>
  );
};
