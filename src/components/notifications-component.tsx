// import { useObservable } from "dexie-react-hooks";
// import { bfgDb } from "~/data/bfg-db";
// import { DexieInvitation } from "~/pages-old/dexie-status/dexie-invitation";


// export const NotificationsComponent = () => {

//   const allInvites = useObservable(bfgDb.cloud.invites)

//   console.log("NotificationsComponent: allInvites", allInvites);
//   const invites = allInvites?.filter((i) => !i.accepted && !i.rejected)

//   const getNotificationsLabel = () => {
//     if (!invites || invites.length === 0) {
//       return "No notifications";
//     }
//     if (invites.length === 1) {
//       return "1 notification";
//     }
//     return `${invites.length} notifications`;
//   }

//   const notificationsLabel = getNotificationsLabel();


//   return (
//     <div>
//       <h4>{notificationsLabel}</h4>

//       {
//         invites?.map((invitation) => (
//           <DexieInvitation invitation={invitation} />
//           // <div key={notification.id}>
//           //   <div>{notification.message}</div>
//           //   <div>{notification.from}</div>
//           //   <div>{notification.to}</div>
//           //   <div>{notification.createdAt.toLocaleString()}</div>
//           // </div>
//         ))
//       }
//     </div>
//   );
// };
