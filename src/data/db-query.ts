import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db"


export const useLiveLobbies = () => {
  const lobbies = useLiveQuery(async () => {
    return await bfgDb.myGameLobbies.toArray();
  })
  return lobbies;
}


// export const useLiveJustSomeData = () => {
//   const justSomeData = useLiveQuery(async () => {
//     return await bfgDb.justSomeData.toArray();
//   })
//   return justSomeData;
// }
