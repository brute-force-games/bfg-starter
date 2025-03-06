import { createContext, useContext } from 'react';
import { PlayerProfileId } from '../../types/core/branded-values/bfg-branded-ids';


export interface bfgDevData {
  player1Id: PlayerProfileId;
  player2Id: PlayerProfileId;
  player3Id: PlayerProfileId;
  player4Id: PlayerProfileId;
}

export interface MyPlayerContextData {
  myPlayerId: PlayerProfileId;
  bfgDevData: bfgDevData;
}


export const MyPlayerContext = createContext<MyPlayerContextData | null>(null);

export const useMyPlayerContext = () => {
  const context = useContext(MyPlayerContext);
  if (!context) {
    throw new Error('useMyPlayerContext must be used within MyPlayerProvider');
  }
  return context;
}; 
