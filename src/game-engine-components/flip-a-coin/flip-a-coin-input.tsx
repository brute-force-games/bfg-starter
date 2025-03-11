import { GameTableSeat } from "~/types/core/game-table/game-table";
import { FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT, FlipACoinGameAction, FlipACoinGameState } from "~/types/bfg-game-engines/flip-a-coin-engine";
import { Button } from "@mui/material";


interface FlipACoinInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
  mostRecentAction: FlipACoinGameAction;
  onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void;
}

export const FlipACoinInput = (props: FlipACoinInputProps) => {
  const { myPlayerSeat, gameState, onGameAction } = props;
  
  const chosenCoin = gameState.chosenCoin;
  const flipOutcome = gameState.flipResult;
  const myPlayerOutcomePreference = gameState.playerFlipResultPreferences[myPlayerSeat];


  const chooseCoin = (coinType: "penny" | "nickel" | "dime" | "quarter") => {
    onGameAction(gameState, { 
      actionType: "game-table-action-player-choose-coin", 
      seat: myPlayerSeat,
      chosenCoin: coinType,
    });
  }

  const preferOutcome = (outcome: "heads" | "tails" | "no-preference") => {
    onGameAction(gameState, { 
      actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT,
      seat: myPlayerSeat,
      preferredFlipResult: outcome,
    });
  }

  const doFlipCoin = () => {
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    
    onGameAction(gameState, { 
      actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN,
      seat: myPlayerSeat,
      flipResult: outcome,
    });
  }

  const doFinishGame = () => {
    if (flipOutcome === undefined) {
      onGameAction(gameState, {
        actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
        seat: myPlayerSeat,
        cancellationReason: "Error - coin has not been flipped before someone can call it",
      });
      return;
    }

    onGameAction(gameState, { 
      actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME,
      seat: myPlayerSeat,
      calledFlipResult: flipOutcome,
    });
  }

  const doCancelGame = () => {
    onGameAction(gameState, {
      actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
      seat: myPlayerSeat,
      cancellationReason: `Flip cancelled by ${myPlayerSeat}`,
    });
  }

  if (gameState.isGameOver) {
    return (
      <div>
        <div>--------------------------------</div>
      </div>
    );
  }


  return (
    <div>
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
        <Button onClick={doFinishGame} disabled={flipOutcome === undefined}>Call the Flip</Button>
        <Button onClick={doCancelGame} disabled={flipOutcome !== undefined}>Cancel the Flip</Button>
      </div>
    </div>
  );
}
