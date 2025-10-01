import { Groups, Wifi } from "@mui/icons-material"
import { Container } from "@mui/material"
import { useCallback, useEffect } from "react"
import { z } from "zod"
import { HostedGameView } from "~/components/game-view/hosted-game-view"
import { asHostApplyMoveFromPlayer } from "~/data/game-table-ops/as-host-apply-move-from-player"
import { matchPlayerToSeat } from "~/data/game-table-ops/player-seat-utils"
import { useHostedP2pGame } from "~/hooks/p2p/use-hosted-p2p-game"
import { useGameActions } from "~/hooks/stores/use-game-actions-store"
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store"
import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { GameTable } from "~/models/game-table/game-table"
import { addGameAction } from "~/store/hosted-game-actions-store"
import { updateHostedGame } from "~/store/hosted-games-store"
import { AllBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines"
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games"
import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json"
import { PlayerGameView } from "../game-view/player-game-view"
import { TabsContainerPanel } from "../tabs-container-panel"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { HostedGameDetailsComponent } from "../p2p-game/host-game-details-component"


interface HostedP2pGameComponentProps {
  gameTableId: GameTableId
}


export const HostedP2pGameComponent = ({ gameTableId }: HostedP2pGameComponentProps) => {

  const hostPlayerProfile = useMyDefaultPlayerProfile();
  
  const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);

  const hostedP2pGame = useHostedP2pGame(hostedGame, hostPlayerProfile);
  const { peerProfiles, playerProfiles, room, getPlayerMove, sendGameTableData, sendGameActionsData } = hostedP2pGame;

  if (!hostPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
        <div className="text-gray-600">Loading profile details...</div>
      </div>
    )
  }

  if (!hostedGame) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

  if (!myPlayerSeat) {
    console.log("You are not at this game table")
    console.log("hostedGame", hostedGame)
    console.log("myPlayerSeat", myPlayerSeat)
    console.log("hostPlayerProfile.id", hostPlayerProfile.id)
    console.log("hostedGame.gameHostPlayerProfileId", hostedGame.gameHostPlayerProfileId)
    return <div>You are not at this game table</div>;
  }

  const gameTitle = hostedGame.gameTitle;
  const gameMetadata = AllBfgGameMetadata[gameTitle];
  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;

  const doSendGameData = useCallback(() => {
    if (hostedGame && gameActions) {
      const gameData: GameTable = {
        ...hostedGame,
      }

      sendGameTableData(gameData);
      sendGameActionsData(gameActions);
    }
  }, [hostedGame, gameActions, sendGameTableData, sendGameActionsData])

  useEffect(() => {
    doSendGameData();
  }, [doSendGameData])

  // Handle peer connections
  room.onPeerJoin(_peer => {
    doSendGameData();
  })

  const handlePlayerMove = async (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
    const actionJson = move as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
    const playerMoveJson = gameEngine.parseGameSpecificActionJson(actionJson);
    console.log('HOST RECEIVED playerMoveJson', playerMoveJson);
    
    const moveResult = await asHostApplyMoveFromPlayer(hostedGame, gameActions, hostPlayerProfile.id, playerMoveJson);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGameAction(hostedGame.id, updatedGameAction);
    }
  }

  
  getPlayerMove(async (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => {
    console.log('Received player move from peer:', peer, move);
    await handlePlayerMove(move);
  })


  // return (
  //   <HostedGameView
  //     myPlayerProfile={hostPlayerProfile}
  //     onPlayerGameAction={handlePlayerMove}
  //     myPlayerSeat={myPlayerSeat}
  //     hostedGame={hostedGame}
  //     gameActions={gameActions}
  //     peerProfiles={peerProfiles}
  //     playerProfiles={playerProfiles}
  //   />
  // )

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Hosted Game",
            icon: <Groups />,
            content: (
              <HostedGameView
                myPlayerProfile={hostPlayerProfile}
                onPlayerGameAction={handlePlayerMove}
                myPlayerSeat={myPlayerSeat}
                hostedGame={hostedGame}
                gameActions={gameActions}
                peerProfiles={peerProfiles}
                playerProfiles={playerProfiles}
              />
            )
          },
          {
            title: "Player Game",
            icon: <Groups />,
            content: (
              <PlayerGameView
                myPlayerProfile={hostPlayerProfile}
                myPlayerSeat={myPlayerSeat}
                gameTable={hostedGame}
                gameActions={gameActions}
                onPlayerGameAction={handlePlayerMove}
              />

            )
          },
          {
            title: "Host Details",
            icon: <Groups />,
            content: (
              <HostedGameDetailsComponent
                hostedGame={hostedGame}
                gameActions={gameActions}
              />
            )
          },
          {
            title: "P2P",
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={hostedP2pGame.connectionStatus}
                peerProfiles={hostedP2pGame.peerProfiles}
                playerProfiles={hostedP2pGame.playerProfiles}
              />
            )
          },
        ]}
        tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        ariaLabel="player lobby tabs"
      />
    </Container>
  )
}
