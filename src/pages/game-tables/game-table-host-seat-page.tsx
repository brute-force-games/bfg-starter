// import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
// import { DbGameTable } from "~/types/core/game-table/game-table";
// import { TableSeatComponent } from "./table-seat-component";
// import { Button } from "@mui/material";
// import { asHostStartGame } from "~/data/bfg-db-game-tables";


// interface IGameTableHostSeatPageProps {
//   playerId: DbPlayerProfileId;
//   gameTable: DbGameTable;
// }


// export const GameTableHostSeatPage = ({ playerId, gameTable }: IGameTableHostSeatPageProps) => {
  
//   return (
//     <div>
//       <h1>Game Table Host Page</h1>
//       <p>MyPlayer ID: {playerId}</p>

//       <p>I am host</p>
//       <Button onClick={async () => {
//         console.log("GameTableHostSeatPage: gameTable", gameTable);
//         await asHostStartGame(gameTable.id);
//       }}>
//         Start Game
//       </Button>
      
//       <TableSeatComponent myPlayerId={playerId} playerSeat="p1" gameTable={gameTable} />
//       <TableSeatComponent myPlayerId={playerId} playerSeat="p2" gameTable={gameTable} />

//     </div>
//   );
// };
