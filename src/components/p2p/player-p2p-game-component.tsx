import { usePlayerP2pGame } from "~/hooks/p2p/use-player-p2p-game"
import { PrivatePlayerProfile } from "~/models/private-player-profile"
import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"
import { PlayerGameView } from "../game-view/player-game-view"
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json"
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games"
import { PeerProfilesComponent } from "./peer-profiles-component"


interface IPlayerP2pGameComponentProps {
  gameTableId: GameTableId
  playerProfile: PrivatePlayerProfile
}

export const PlayerP2pGameComponent = ({ gameTableId, playerProfile }: IPlayerP2pGameComponentProps) => {

  const p2pGame = usePlayerP2pGame(gameTableId, playerProfile);

  if (!p2pGame) {
    return <div>Loading P2P Game...</div>;
  }

  const { gameTable, gameActions, myPlayerSeat, sendPlayerMove, peerProfiles, playerProfiles } = p2pGame;

  if (!gameTable || !gameActions || !myPlayerSeat) {
    console.log("gameTable", gameTable)
    console.log("gameActions", gameActions)
    console.log("myPlayerSeat", myPlayerSeat)
    return <div>Loading game content...</div>;
  }

  const onPlayerGameAction = (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
    sendPlayerMove(move);
  }

  return (
    <>
      <PlayerGameView
        myPlayerProfile={playerProfile}
        myPlayerSeat={myPlayerSeat}
        gameTable={gameTable}
        gameActions={gameActions}
        onPlayerGameAction={onPlayerGameAction}
      />
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
    </>
  )
}
