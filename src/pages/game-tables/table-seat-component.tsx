import { sitAtGameTable } from "~/data/bfg-db-game-tables";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { DbGameTable, GameTableSeat } from "~/types/core/game-table/game-table";


interface ITableSeatComponentProps {
  myPlayerId: DbPlayerProfileId;
  playerSeat: GameTableSeat;
  gameTable: DbGameTable;
}
 

export const TableSeatComponent = ({ 
  myPlayerId,
  playerSeat,
  gameTable,
}: ITableSeatComponentProps) => {
  
  const playerInSeatId = gameTable[playerSeat];
  const isSeatAvailable = !playerInSeatId;
  const seatLabel = playerSeat.toUpperCase() + ": ";

  if (isSeatAvailable) {
    return (
      <>
        {seatLabel}
        <button onClick={async () => {
          if (!myPlayerId) {
            console.log("GameTableSeatPage: playerId is undefined");
            return;
          }
          await sitAtGameTable(gameTable.id, myPlayerId, playerSeat);
        }}>
          Sit here
        </button>
      </>
    )
  } else {
    return <div>{seatLabel}Seat taken {playerInSeatId}</div>;
  }
}
