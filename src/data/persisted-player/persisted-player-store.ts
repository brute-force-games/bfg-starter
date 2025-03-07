import { createContext, useContext } from 'react';
import { GamePlayerId } from '~/types/core/branded-values/bfg-branded-ids';
import { DbPlayerProfileId } from '~/types/core/branded-values/branded-strings';


export interface SpgDevData {
  player1Id: DbPlayerProfileId;
  player2Id: DbPlayerProfileId;
  player3Id: DbPlayerProfileId;
  player4Id: DbPlayerProfileId;
}

export interface MyPlayerContextData {
  myPlayerId: GamePlayerId;
  spgDevData: SpgDevData;
}


export const MyPlayerContext = createContext<MyPlayerContextData | null>(null);

export const useMyPlayerContext = () => {
  const context = useContext(MyPlayerContext);
  if (!context) {
    throw new Error('useMyPlayerContext must be used within MyPlayerProvider');
  }
  return context;
}; 
