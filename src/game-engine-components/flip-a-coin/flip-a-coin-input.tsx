import { GameTableSeat } from "~/types/core/game-table/game-table";
import { FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";


interface FlipACoinInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
}

export const FlipACoinInput = (props: FlipACoinInputProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <div>
      <div>Flip A Coin Input</div>
      <div>My Player Seat: {myPlayerSeat}</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
