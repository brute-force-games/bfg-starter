import { TicTacToeGameState } from "~/types/game-engines/tic-tac-toe-engine";


interface TicTacToeInputProps {
  gameState: TicTacToeGameState;
}

export const TicTacToeInput = (props: TicTacToeInputProps) => {
  const { gameState } = props;

  return (
    <div>
      <div>Tic Tac Toe Input</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
