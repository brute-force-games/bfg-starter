
import { useState } from "react";
import { LetterChoice } from "~/types/bfg-game-engines/hangman-engine";

interface HangmanLetterInputProps {
  disabledLetters: LetterChoice[];
  onSubmit?: (letter: LetterChoice) => void;
}

export const HangmanLetterInput = ({ 
  disabledLetters,
  onSubmit
}: HangmanLetterInputProps) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterChoice | null>(null);

  const alphabet: LetterChoice[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z',
  ];

  const handleLetterClick = (letter: LetterChoice) => {
    if (disabledLetters.includes(letter)) return;
    
    // If clicking the same letter, deselect it
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      // Select the new letter
      setSelectedLetter(letter);
    }
  };

  const handleSubmit = () => {
    if (selectedLetter && onSubmit) {
      onSubmit(selectedLetter);
      setSelectedLetter(null);
    }
  };

  const isLetterDisabled = (letter: LetterChoice) => {
    return disabledLetters.includes(letter);
  };

  const getLetterButtonStyle = (letter: LetterChoice) => {
    const baseStyle = {
      padding: "12px 16px",
      margin: "4px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#ddd",
      borderRadius: "8px",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      minWidth: "40px",
      textAlign: "center" as const,
      transition: "all 0.2s ease",
      userSelect: "none" as const,
    };

    if (isLetterDisabled(letter)) {
      return {
        ...baseStyle,
        backgroundColor: "#f5f5f5",
        color: "#ccc",
        cursor: "not-allowed",
        borderColor: "#eee",
      };
    }

    // Selected letter styling
    if (selectedLetter === letter) {
      return {
        ...baseStyle,
        backgroundColor: "#007bff",
        color: "#fff",
        borderColor: "#007bff",
        transform: "scale(1.05)",
      };
    }

    return baseStyle;
  };

  const keyboardRows = [
    alphabet.slice(0, 7),   // A-G
    alphabet.slice(7, 14),  // H-N
    alphabet.slice(14, 21), // O-U
    alphabet.slice(21, 26), // V-Z
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-start", 
        gap: "30px",
        justifyContent: "center"
      }}>
        {/* Letter keyboard */}
        <div style={{ flex: "0 0 auto" }}>
          {keyboardRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              style={{ 
                display: "flex", 
                justifyContent: "center", 
                flexWrap: "wrap",
                marginBottom: "8px"
              }}
            >
              {row.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  disabled={isLetterDisabled(letter)}
                  style={getLetterButtonStyle(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          minHeight: "200px"
        }}>
          <button
            onClick={handleSubmit}
            disabled={!selectedLetter}
            style={{
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: selectedLetter ? "#28a745" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: selectedLetter ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              minWidth: "120px",
            }}
            onMouseEnter={(e) => {
              if (selectedLetter) {
                e.currentTarget.style.backgroundColor = "#218838";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedLetter) {
                e.currentTarget.style.backgroundColor = "#28a745";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            Submit Guess
          </button>
        </div>
      </div>

      {/* {disabledLetters.length > 0 && (
        <div style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7"
        }}>
          <div style={{ 
            fontSize: "14px", 
            color: "#856404",
            textAlign: "center"
          }}>
            <strong>Already guessed:</strong> {disabledLetters.join(", ")}
          </div>
        </div>
      )} */}
    </div>
  );
};