interface HangmanStickFigureProps {
  wrongGuesses: number;
  maxWrongGuesses: number;
}

export const HangmanStickFigure = ({ wrongGuesses, maxWrongGuesses }: HangmanStickFigureProps) => {
  // Clamp maxWrongGuesses to valid range (1-10)
  const clampedMaxGuesses = Math.max(1, Math.min(10, maxWrongGuesses));
  
  // Calculate percentage of wrong guesses (0-1)
  const wrongGuessPercentage = Math.min(wrongGuesses / clampedMaxGuesses, 1);
  
  // Define which parts should be visible based on percentage
  // We have 10 body parts total, so each part represents 10% of the figure
  const showHead = wrongGuessPercentage >= 0.1; // 1/10
  const showNeck = wrongGuessPercentage >= 0.2; // 2/10
  const showBody = wrongGuessPercentage >= 0.3; // 3/10
  const showLeftArm = wrongGuessPercentage >= 0.4; // 4/10
  const showRightArm = wrongGuessPercentage >= 0.5; // 5/10
  const showLeftHand = wrongGuessPercentage >= 0.6; // 6/10
  const showRightHand = wrongGuessPercentage >= 0.7; // 7/10
  const showLeftLeg = wrongGuessPercentage >= 0.8; // 8/10
  const showRightLeg = wrongGuessPercentage >= 0.9; // 9/10
  const showFeet = wrongGuessPercentage >= 1.0; // 10/10

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="200" height="300" viewBox="0 0 200 300" style={{ border: '1px solid #ccc' }}>
        {/* Gallows - always visible */}
        <g id="gallows">
          {/* Base */}
          <line x1="20" y1="280" x2="120" y2="280" stroke="#8B4513" strokeWidth="4" />
          {/* Vertical post */}
          <line x1="70" y1="280" x2="70" y2="40" stroke="#8B4513" strokeWidth="4" />
          {/* Top horizontal beam */}
          <line x1="70" y1="40" x2="150" y2="40" stroke="#8B4513" strokeWidth="4" />
          {/* Rope */}
          <line x1="150" y1="40" x2="150" y2="70" stroke="#654321" strokeWidth="2" />
        </g>

        {/* Head */}
        <g id="head" style={{ opacity: showHead ? 1 : 0 }}>
          <circle cx="150" cy="80" r="10" fill="none" stroke="#000" strokeWidth="2" />
        </g>

        {/* Neck */}
        <g id="neck" style={{ opacity: showNeck ? 1 : 0 }}>
          <line x1="150" y1="90" x2="150" y2="100" stroke="#000" strokeWidth="2" />
        </g>

        {/* Body */}
        <g id="body" style={{ opacity: showBody ? 1 : 0 }}>
          <line x1="150" y1="100" x2="150" y2="180" stroke="#000" strokeWidth="2" />
        </g>

        {/* Left Arm */}
        <g id="leftArm" style={{ opacity: showLeftArm ? 1 : 0 }}>
          <line x1="150" y1="120" x2="120" y2="150" stroke="#000" strokeWidth="2" />
        </g>

        {/* Right Arm */}
        <g id="rightArm" style={{ opacity: showRightArm ? 1 : 0 }}>
          <line x1="150" y1="120" x2="180" y2="150" stroke="#000" strokeWidth="2" />
        </g>

        {/* Left Hand */}
        <g id="leftHand" style={{ opacity: showLeftHand ? 1 : 0 }}>
          <circle cx="120" cy="150" r="5" fill="none" stroke="#000" strokeWidth="2" />
        </g>

        {/* Right Hand */}
        <g id="rightHand" style={{ opacity: showRightHand ? 1 : 0 }}>
          <circle cx="180" cy="150" r="5" fill="none" stroke="#000" strokeWidth="2" />
        </g>

        {/* Left Leg */}
        <g id="leftLeg" style={{ opacity: showLeftLeg ? 1 : 0 }}>
          <line x1="150" y1="180" x2="120" y2="220" stroke="#000" strokeWidth="2" />
        </g>

        {/* Right Leg */}
        <g id="rightLeg" style={{ opacity: showRightLeg ? 1 : 0 }}>
          <line x1="150" y1="180" x2="180" y2="220" stroke="#000" strokeWidth="2" />
        </g>

        {/* Feet */}
        <g id="feet" style={{ opacity: showFeet ? 1 : 0 }}>
          <line x1="120" y1="220" x2="110" y2="215" stroke="#000" strokeWidth="2" />
          <line x1="180" y1="220" x2="190" y2="215" stroke="#000" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
