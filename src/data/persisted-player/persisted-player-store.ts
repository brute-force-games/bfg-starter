// import { createContext, useContext } from 'react';
// import { DbPlayerProfileId } from '~/types/core/branded-values/branded-strings';


// export interface SpgDevData {
//   player1ProfileId: DbPlayerProfileId;
//   player2ProfileId: DbPlayerProfileId;
//   player3ProfileId: DbPlayerProfileId;
//   player4ProfileId: DbPlayerProfileId;
// }

// export interface MyPlayerContextData {
//   myPlayerId: DbPlayerProfileId;
//   spgDevData: SpgDevData;
// }


// export const MyPlayerContext = createContext<MyPlayerContextData | null>(null);

// export const useMyPlayerContext = () => {
//   const context = useContext(MyPlayerContext);
//   if (!context) {
//     throw new Error('useMyPlayerContext must be used within MyPlayerProvider');
//   }
//   return context;
// }; 
