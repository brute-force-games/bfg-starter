// import { useParams } from "react-router-dom";
// import { GameTableDetailsComponent } from "~/components/game-table-details/game-table-details-component";
// import { useLiveGameTable } from "~/data/bfg-db-game-tables";
// import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
// import { DbGameTableId } from "~/types/core/branded-values/branded-strings";


// export const GameTableDetailsPage = () => {

//   const { gameTableId } = useParams();
//   const whoAmI = useBfgWhoAmIContext();

//   const gameTable = useLiveGameTable(gameTableId as DbGameTableId);

//   // const playerId = whoAmI.playerId;

//   // if (!playerId) {
//   //   return <div>No player id found</div>;
//   // }

//   const profileId = whoAmI.defaultPlayerProfileId;

//   if (!profileId) {
//     return <div>No player profile id found</div>;
//   }

//   if (!gameTable) {
//     return <div>No game table found</div>;
//   }


//   return (
//     <>
//       <GameTableDetailsComponent gameTable={gameTable} />
//     </>
//   )
// }
