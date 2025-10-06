import { TicTacToeGameState } from "~/types/bfg-game-engines/tic-tac-toe-engine";
import { GameTableSeat } from "~/models/game-table/game-table";


interface TicTacToeInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: TicTacToeGameState;
}

export const TicTacToeInput = (props: TicTacToeInputProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <div>
      <div>Tic Tac Toe Input</div>
      <div>My Player Seat: {myPlayerSeat}</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
