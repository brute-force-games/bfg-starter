import { TicTacToeGameState } from "~/types/game-engines/tic-tac-toe-engine";
import { GameTableSeat } from "~/types/core/game-table/game-table";


interface TicTacToeRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: TicTacToeGameState;
}

export const TicTacToeRepresentation = (props: TicTacToeRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <div>
      <div>Tic Tac Toe Representation</div>
      <div>My Player Seat: {myPlayerSeat}</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
