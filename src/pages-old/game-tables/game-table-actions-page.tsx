// import { useParams } from "react-router-dom";
// import { GameTableActionComponent } from "~/components/game-table-action-component";
// import { useLiveGameTableActions } from "~/data/bfg-db-game-tables";
// import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
// import { DbGameTableId } from "~/types/core/branded-values/branded-strings";


// export const GameTableActionsPage = () => {

//   const { gameTableId } = useParams();
//   const whoAmI = useBfgWhoAmIContext();

//   const gameTableActions = useLiveGameTableActions(gameTableId as DbGameTableId);
//   // const gameTableActions = useLiveQuery(async () => {
//   //   if (!gameTableId) {
//   //     return undefined;
//   //   }
//   //   return await bfgDb.gameTableActions.where('gameTableId').equals(gameTableId).toArray();
//   // })  

//   // const playerId = whoAmI.playerId;
//   const profileId = whoAmI.defaultPlayerProfileId;

//   if (!profileId) {
//     return <div>No player profile id found</div>;
//   }

//   if (!gameTableActions) {
//     return <div>No game table actions found</div>;
//   }


//   return (
//     <>
//       {gameTableActions.map((action) => (
//         <GameTableActionComponent key={action.id} action={action} />
//       ))}
//     </>
//   )
// }
