import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { HangmanGameAction, HangmanGameState } from "~/types/bfg-game-engines/hangman-engine";
import { HangmanInput } from "./hangman-input";
import { HangmanRepresentation } from "./representation/hangman-representation";
import { isHangmanGuessingActive } from "./hangman-utils";
import { useState } from "react";


export const createHangmanRepresentation = (
  myPlayerSeat: GameTableSeat,
  gameState: HangmanGameState,
  mostRecentAction: HangmanGameAction
) => {

  return (
    <HangmanRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
    />
  );
}


export const createHangmanInput = (
  myPlayerSeat: GameTableSeat,
  gameState: HangmanGameState,
  mostRecentAction: HangmanGameAction,
  onGameAction: (gameState: HangmanGameState, gameAction: HangmanGameAction) => void
) => {
  return (
    <HangmanInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
      onGameAction={onGameAction}
    />
  );
}


export const createHangmanComboRepresentationAndInput = (
  myPlayerSeat: GameTableSeat,
  gameState: HangmanGameState,
  _mostRecentAction: HangmanGameAction,
  _onGameAction: (gameState: HangmanGameState, gameAction: HangmanGameAction) => void
) => {
  
  return (
    <>
      <HangmanRepresentation
        myPlayerSeat={myPlayerSeat}
        gameState={gameState}
        mostRecentAction={_mostRecentAction}
      />
      <HangmanInput
        myPlayerSeat={myPlayerSeat}
        gameState={gameState}
        mostRecentAction={_mostRecentAction}
        onGameAction={_onGameAction}
      />  
    </>
  )
}


export const createHangmanHostComponent = (
  _gameTable: GameTable,
  gameState: HangmanGameState,
  _mostRecentAction: HangmanGameAction,
  onGameAction: (gameState: HangmanGameState, gameAction: HangmanGameAction) => void
) => {

  const gameActive = isHangmanGuessingActive(gameState);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleConfirmWordSource = () => {
    if (!selectedOption) {
      alert("Please select a word source first!");
      return;
    }

    // Create the finalization action based on selection
    let finalizationAction: HangmanGameAction;

    if (selectedOption === 'internal-word-list') {
      finalizationAction = {
        actionType: 'hangman-game-table-action-host-finalizes-hidden-word',
        source: { source: 'internal-word-list' }
      };
    } else {
      // selectedOption should be a player seat
      finalizationAction = {
        actionType: 'hangman-game-table-action-host-finalizes-hidden-word',
        source: { source: 'player', seat: selectedOption as any }
      };
    }

    onGameAction(gameState, finalizationAction);
  };


  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Game Status Section */}
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>
        {gameActive ? (
          <div style={{ color: "#28a745", fontWeight: "bold" }}>
            Game Active - Current Word: {gameState.hiddenWordState || "Not set"}
          </div>
        ) : (
          <div style={{ color: "#dc3545" }}>
            {/* {hiddenWordStatusLabel} */}
          </div>
        )}
      </div>

      {/* Host Controls Section - Only show when game is NOT active */}
      {!gameActive && (
        <div style={{ 
          border: "2px solid #dee2e6", 
          borderRadius: "10px", 
          padding: "20px", 
          marginBottom: "20px",
          backgroundColor: "#f8f9fa"
        }}>
          {/* <h3 style={{ marginBottom: "15px", color: "#495057" }}>Host Controls - Word Setup</h3> */}
          
          <div style={{ marginBottom: "20px" }}>
            {/* <h4 style={{ marginBottom: "15px" }}>Choose Word Source:</h4> */}
            
            {/* Word Source Selection Row */}
            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "flex-end", flexWrap: "wrap", justifyContent: "center" }}>
                <select
                  value={selectedOption || ''}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    border: "2px solid #dee2e6",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    minWidth: "250px"
                  }}
                >
                  <option value="">Select word source...</option>
                  <option value="internal-word-list">Internal Word List</option>
                  {gameState.playerHiddenWordSubmissions.map((submission) => (
                    <option key={submission.seat} value={submission.seat}>
                      Player {submission.seat} - "{submission.info.hiddenWord}"
                    </option>
                  ))}
                </select>

                {/* Confirmation Button */}
                <button
                  onClick={handleConfirmWordSource}
                  disabled={!selectedOption}
                  style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: selectedOption ? "#28a745" : "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: selectedOption ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                    height: "fit-content"
                  }}
                >
                  Confirm & Start Game
                </button>
              </div>
            </div>

            {/* Information Display */}
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              <p>• <strong>Internal Word List:</strong> Randomly selects from mustang, dog, cat, bird, fish</p>
              <p>• <strong>Player's Word:</strong> Uses a word submitted by a player</p>
              {gameState.playerHiddenWordSubmissions.length > 0 && (
                <p style={{ color: "#28a745", fontWeight: "bold" }}>
                  Available player submissions: {gameState.playerHiddenWordSubmissions.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game State Debug Info (only show when game is active) */}
      {gameActive && (
        <div style={{ 
          border: "1px solid #dee2e6", 
          borderRadius: "5px", 
          padding: "15px", 
          backgroundColor: "#ffffff",
          textAlign: "left"
        }}>
          <h4 style={{ marginBottom: "10px" }}>Current Game State:</h4>
          <div style={{ fontSize: "14px", color: "#666" }}>
            <p><strong>Hidden Word:</strong> {gameState.hiddenWordInfo?.hiddenWord}</p>
            <p><strong>Current State:</strong> {gameState.hiddenWordState}</p>
            <p><strong>Wrong Guesses:</strong> {gameState.numberOfWrongGuesses} / {gameState.hiddenWordInfo?.numberOfWrongGuessesToLose}</p>
            <p><strong>Letters Guessed:</strong> {gameState.lettersGuessed.join(', ') || 'None'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
