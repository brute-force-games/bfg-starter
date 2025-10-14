import { FlipACoinGameAction, FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { FlipACoinRepresentation } from "./flip-a-coin-representation";
import { FlipACoinInput } from "./flip-a-coin-input";
import { getActivePlayerSeatsForGameTable } from "~/data/game-table-ops/player-seat-utils";


export const createFlipACoinRepresentation = (
  myPlayerSeat: GameTableSeat,
  gameState: FlipACoinGameState,
  mostRecentAction: FlipACoinGameAction
) => {
  return (
    <FlipACoinRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
    />
  );
  
}

export const createFlipACoinInput = (
  myPlayerSeat: GameTableSeat,
  gameState: FlipACoinGameState,
  mostRecentAction: FlipACoinGameAction,
  onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {
  return (
    <FlipACoinInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
      onGameAction={onGameAction}
    />
  );
}

export const createFlipACoinHostRepresentation = (
  gameTable: GameTable,
  gameState: FlipACoinGameState,
  mostRecentAction: FlipACoinGameAction,
  _onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {

  const activePlayerSeats = getActivePlayerSeatsForGameTable(gameTable);

  return (
    <>
      {activePlayerSeats.map(playerSeat => (
        <FlipACoinRepresentation 
          myPlayerSeat={playerSeat} 
          gameState={gameState} 
          mostRecentAction={mostRecentAction}
        />
      ))}
    </>
  )
}

export const createGameStateCombinationRepresentationAndInputComponent = (
  myPlayerSeat: GameTableSeat,
  gameState: FlipACoinGameState,
  mostRecentAction: FlipACoinGameAction,
  onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {
  return (
    <>
      <FlipACoinRepresentation 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
      />
      <FlipACoinInput 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
        onGameAction={onGameAction}
      />
    </>
  );
}
