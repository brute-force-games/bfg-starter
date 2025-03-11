import { useState } from 'react';
// import { BfgPlayerId, createPlayerId } from '../../types/core/branded-values/bs-player-id';
import { MyPlayerContext, SpgDevData } from './persisted-player-store';
import { BfgBrandedIds, BfgPlayerProfileId, PlayerProfileId } from '~/types/core/branded-values/bfg-branded-ids';


const PLAYER_ID_KEY = 'my_bfg_player_id';

const SPG_DEV_KEY = 'spg_dev_data';



export const MyPlayerProvider = ({ children }: { children: React.ReactNode }) => {

  const [myPlayerId, ] = useState<PlayerProfileId>((): PlayerProfileId => {
    const storedId = localStorage.getItem(PLAYER_ID_KEY);
    if (storedId) {
      const result = BfgPlayerProfileId.idSchema.safeParse(storedId);
      if (result.success) {
        return result.data as PlayerProfileId;
      }
    }
    
    const newId = BfgPlayerProfileId.createId();
    console.warn("MyPlayerProvider: newId", newId);
    localStorage.setItem(PLAYER_ID_KEY, newId);
    return newId as PlayerProfileId;
  });

  const [spgDevData, ] = useState<SpgDevData>(() => {
    const storedData = localStorage.getItem(SPG_DEV_KEY);
    if (storedData) {
      return JSON.parse(storedData) as SpgDevData;
    }
    
    const newSpgDevData: SpgDevData = {
      player1ProfileId: BfgBrandedIds.PlayerProfileId.createId(),
      player2ProfileId: BfgBrandedIds.PlayerProfileId.createId(),
      player3ProfileId: BfgBrandedIds.PlayerProfileId.createId(),
      player4ProfileId: BfgBrandedIds.PlayerProfileId.createId(),
    };
    localStorage.setItem(SPG_DEV_KEY, JSON.stringify(newSpgDevData));
    return newSpgDevData;
  });

  // useEffect(() => {
  //   localStorage.setItem(PLAYER_ID_KEY, myPlayerId);
  //   localStorage.setItem(SPG_DEV_KEY, JSON.stringify(spgDevData));
  // }, [myPlayerId, spgDevData]);

  return (
    <MyPlayerContext.Provider value={{
      myPlayerId,
      spgDevData,
    }}>
      {children}
    </MyPlayerContext.Provider>
  );
};
