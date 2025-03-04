import { createContext, useContext } from 'react';
import { BfgPlayerId } from '../../types/core/branded-values/bs-player-id';


export interface bfgDevData {
  player1Id: BfgPlayerId;
  player2Id: BfgPlayerId;
  player3Id: BfgPlayerId;
  player4Id: BfgPlayerId;
}

export interface MyPlayerContextData {
  myPlayerId: BfgPlayerId;
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
