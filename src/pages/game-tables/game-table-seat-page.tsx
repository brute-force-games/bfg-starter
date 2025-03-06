import { Link, useParams } from "react-router-dom";
import { useLiveGameTable } from "~/data/bfg-db-game-tables";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { TableSeatComponent } from "./table-seat-component";
import { GameTableHostSeatComponent } from "./game-table-host-seat-component";


export const GameTableSeatPage = () => {

  const { gameTableId } = useParams();
  const { playerId } = useBfgWhoAmIContext();

  console.log("GameTableSeatPage: gameTableId", gameTableId);

  const gameTable = useLiveGameTable(gameTableId as DbGameTableId);

  if (!gameTable) {
    return <div>Game Table not found</div>;
  }

  if (!playerId) {
    return <div>Player ID not found</div>;
  }

  
  return (
    <div>
      <h1>Game Table Seat Page</h1>
      <p>Game Table ID: {gameTableId}</p>
      <p>MyPlayer ID: {playerId}</p>

      <p>Game Host Player ID: {gameTable.gameHostPlayerId}</p>
      <GameTableHostSeatComponent myPlayerId={playerId} gameTable={gameTable} />
      <Link to={`/game-tables/${gameTableId}/next-action`}>Next Action</Link>
      
      <TableSeatComponent myPlayerId={playerId} playerSeat="p1" gameTable={gameTable} />
      <TableSeatComponent myPlayerId={playerId} playerSeat="p2" gameTable={gameTable} />

    </div>
  );
};
