// import { Link } from "react-router-dom";
// import { isPlayerAtGameTable } from "~/data/game-table-ops/player-seat-utils";
// import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
// import { DbGameTable } from "~/models/game-table/game-table";


// export const GameTablePlayerOptionsComponent = (props: {
//   myPlayerProfileId: PlayerProfileId;
//   gameTable: DbGameTable;
// }) => {

//   const { myPlayerProfileId, gameTable } = props;

//   const amIAtTable = isPlayerAtGameTable(myPlayerProfileId, gameTable);

//   if (gameTable.tablePhase === 'table-phase-lobby') {
//     return (
//       <>
//         <div>Game not started</div>
//         <div><Link to={`/game-tables/${gameTable.id}/seat`}>Take Seat</Link></div>
//       </>
//     );
//   }

//   if (gameTable.tablePhase === 'table-phase-game-in-progress') {
//     if (amIAtTable) {
//       return (
//         <>
//           <div>I am already playing</div>
//           <div>
//             <Link to={`/game-tables/${gameTable.id}/next-action`}>Next Action</Link>
//           </div>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <div>Game in progress</div>
//           <div>
//             <Link to={`/game-tables/${gameTable.id}/watch`}>Watch Game</Link>
//           </div>
//         </>
//       );
//     }
//   }

//   return <div>This is an unexpected table phase: {gameTable.tablePhase}</div>;
// };
