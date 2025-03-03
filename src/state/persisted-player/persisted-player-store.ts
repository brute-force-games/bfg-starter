import { createContext, useContext } from 'react';
import { PlayerId } from '../../types/core/branded-values/bs-player-id';


export interface bfgDevData {
  player1Id: PlayerId;
  player2Id: PlayerId;
  player3Id: PlayerId;
  player4Id: PlayerId;
}

export interface MyPlayerContextData {
  myPlayerId: PlayerId;
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
