import { useState } from 'react';
import { PlayerId, createPlayerId } from '../../types/core/branded-values/bs-player-id';
import { MyPlayerContext, bfgDevData } from './persisted-player-store';

const PLAYER_ID_KEY = 'my_secret_pyramid_game_player_id';

const SPG_DEV_KEY = 'spg_dev_data';



export const MyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [myPlayerId, ] = useState<PlayerId>(() => {
    const storedId = localStorage.getItem(PLAYER_ID_KEY);
    if (storedId) {
      return storedId as PlayerId;
    }
    const newId = createPlayerId();
    localStorage.setItem(PLAYER_ID_KEY, newId);
    return newId;
  });

  const [bfgDevData, ] = useState<bfgDevData>(() => {
    const storedData = localStorage.getItem(SPG_DEV_KEY);
    if (storedData) {
      return JSON.parse(storedData) as bfgDevData;
    }
    const newbfgDevData: bfgDevData = {
      player1Id: createPlayerId(),
      player2Id: createPlayerId(),
      player3Id: createPlayerId(),
      player4Id: createPlayerId(),
    };
    localStorage.setItem(SPG_DEV_KEY, JSON.stringify(newbfgDevData));
    return newbfgDevData;
  });

  // useEffect(() => {
  //   localStorage.setItem(PLAYER_ID_KEY, myPlayerId);
  //   localStorage.setItem(SPG_DEV_KEY, JSON.stringify(bfgDevData));
  // }, [myPlayerId, bfgDevData]);

  return (
    <MyPlayerContext.Provider value={{
      myPlayerId,
      bfgDevData,
    }}>
      {children}
    </MyPlayerContext.Provider>
  );
};
