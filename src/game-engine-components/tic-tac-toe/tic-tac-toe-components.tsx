import { TicTacToeGameAction, TicTacToeGameState, TicTacToeMove } from "~/types/bfg-game-engines/tic-tac-toe-engine";
import { TicTacToeInput } from "./tic-tac-toe-input";
import { TicTacToeGrid } from "./tic-tac-toe-grid";
import { TicTacToeRepresentation } from "./tic-tac-toe-representation";
import { GameTableSeat } from "~/types/core/game-table/game-table";
import { BfgGameSpecificTableAction } from "~/types/core/game-table/game-table-action";


export const createTicTacToeRepresentation = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState
) => {
  return (
    <TicTacToeRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
  
}

export const createTicTacToeInput = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState
) => {
  return (
    <TicTacToeInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
}


export const createTicTacToeComboRepresentationAndInput = (
  myPlayerSeat: GameTableSeat,
  gameState: TicTacToeGameState,
  _mostRecentAction: TicTacToeGameAction,
  onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {
  // return;

  return (
    <>
      <TicTacToeGrid
        myPlayerSeat={myPlayerSeat}
        gameState={gameState}
        onGameAction={onGameAction}
      />
    </>
  )
}


export const createTicTacToeHistory = (
  _myPlayerSeat: GameTableSeat,
  _gameState: TicTacToeGameState,
  _timeOrderedGameActions: BfgGameSpecificTableAction<TicTacToeGameAction>[]
) => {
  return (
    <>
      Tic Tac Toe History
      {/* {timeOrderedGameActions.map(action => (
        <TicTacToeActionComponent
          myPlayerSeat={myPlayerSeat}
          key={action.gameTableActionId}
          gameTable={gameTable}
          action={action.gameSpecificAction}
        />
      ))} */}
    </>
  )
}