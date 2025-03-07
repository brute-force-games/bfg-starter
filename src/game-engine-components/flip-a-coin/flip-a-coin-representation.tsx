import { GameTableSeat } from "~/types/core/game-table/game-table";
import { FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";


interface FlipACoinRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
}

export const FlipACoinRepresentation = (props: FlipACoinRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <div>
      <div>Flip A Coin Representation</div>
      <div>My Player Seat: {myPlayerSeat}</div>
      <div>Game State: {JSON.stringify(gameState)}</div>
    </div>
  );
}
