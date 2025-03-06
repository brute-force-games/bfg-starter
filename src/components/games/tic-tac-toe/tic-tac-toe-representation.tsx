import { TicTacToeGameState } from "~/types/game-engines/tic-tac-toe-engine";


interface TicTacToeRepresentationProps {
  gameState: TicTacToeGameState;
}

export const TicTacToeRepresentation = (props: TicTacToeRepresentationProps) => {
  const { gameState } = props;

  return (
    <div>
      <div>Tic Tac Toe Representation</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
