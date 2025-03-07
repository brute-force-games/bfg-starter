import { GameTableSeat } from "~/types/core/game-table/game-table";
import { FlipACoinGameAction, FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";
import { Button } from "@mui/material";

interface FlipACoinInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
  onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void;
}

export const FlipACoinInput = (props: FlipACoinInputProps) => {
  const { myPlayerSeat, gameState, onGameAction } = props;
  
  const chosenCoin = gameState.chosenCoin;
  const myPlayerOutcomePreference = gameState.playerOutcomePreferences[myPlayerSeat];


  const chooseCoin = (coinType: "penny" | "nickel" | "dime" | "quarter") => {
    onGameAction(gameState, { actionType: "game-table-action-player-choose-coin", chosenCoin: coinType });
  }

  const preferOutcome = (outcome: "heads" | "tails" | "no-preference") => {
    onGameAction(gameState, { 
      actionType: "game-table-action-player-prefer-outcome",
      seat: myPlayerSeat,
      preferredOutcome: outcome,
    });
  }

  const doFlipCoin = () => {
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    
    onGameAction(gameState, { 
      actionType: "game-table-action-player-flip-coin",
      outcome: outcome,
    });
  }


  return (
    <div>
      {/* <div>Flip A Coin Input</div> */}
      {/* <div>My Player Seat: {myPlayerSeat}</div>
      <div>Game State: {JSON.stringify(gameState)}</div> */}
      <div>--------------------------------</div>
      <div>
        <Button onClick={() => chooseCoin("penny")} disabled={chosenCoin === "penny"}>Use Penny</Button>
        <Button onClick={() => chooseCoin("nickel")} disabled={chosenCoin === "nickel"}>Use Nickel</Button>
        <Button onClick={() => chooseCoin("dime")} disabled={chosenCoin === "dime"}>Use Dime</Button>
        <Button onClick={() => chooseCoin("quarter")} disabled={chosenCoin === "quarter"}>Use Quarter</Button>
      </div>
      <div>
        <Button onClick={() => preferOutcome("heads")} disabled={myPlayerOutcomePreference === "heads"}>Prefer Heads</Button>
        <Button onClick={() => preferOutcome("tails")} disabled={myPlayerOutcomePreference === "tails"}>Prefer Tails</Button>
        <Button onClick={() => preferOutcome("no-preference")} disabled={myPlayerOutcomePreference === "no-preference"}>No Preference</Button>
      </div>
      <div>
        <Button onClick={doFlipCoin}>Flip Coin</Button>
      </div>
    </div>
  );
}
