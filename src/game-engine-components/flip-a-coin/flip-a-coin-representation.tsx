import { GameTableSeat } from "~/models/game-table/game-table";
import { FlipACoinGameAction, FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";



interface FlipACoinRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
  mostRecentAction: FlipACoinGameAction;
}

export const FlipACoinRepresentation = (props: FlipACoinRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  if (gameState.isGameOver) {
    return (
      <div>
        <div>Game is complete - {gameState.outcomeSummary}</div>
      </div>
    );
  }

  if (gameState.isFlipped) {
    return (
      <>
        <div>
          A {gameState.chosenCoin} was flipped and got {gameState.flipResult}
        </div>
        <div>My preferred outcome: {gameState.playerFlipResultPreferences?.[myPlayerSeat]}</div>
        <div>
          {gameState.playerFlipResultPreferences?.[myPlayerSeat] === gameState.flipResult ? (
            <div>:D</div>
          ) : (
            <div>:(</div>
          )}
        </div>
      </>
    );
  }

  

  const coinType = gameState.chosenCoin;

  return (
    <>
      <div>Flipping a {coinType}</div>
      <div>My preferred outcome: {gameState.playerFlipResultPreferences?.[myPlayerSeat]}</div>
    </>
  );
}
