import { useState } from 'react';
import { HangmanStickFigure } from './hangman-stick-figure';

export const HangmanTestDemo = () => {
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [maxWrongGuesses, setMaxWrongGuesses] = useState(6);

  const bodyParts = [
    { name: 'Head', percentage: 0.1 },
    { name: 'Neck', percentage: 0.2 },
    { name: 'Body', percentage: 0.3 },
    { name: 'Left Arm', percentage: 0.4 },
    { name: 'Right Arm', percentage: 0.5 },
    { name: 'Left Hand', percentage: 0.6 },
    { name: 'Right Hand', percentage: 0.7 },
    { name: 'Left Leg', percentage: 0.8 },
    { name: 'Right Leg', percentage: 0.9 },
    { name: 'Feet', percentage: 1.0 },
  ];

  const wrongGuessPercentage = Math.min(wrongGuesses / maxWrongGuesses, 1);

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Hangman Stick Figure Demo</h2>
      
      <div style={{ margin: '20px 0' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="maxWrongGuesses">Max Wrong Guesses: {maxWrongGuesses}</label>
          <br />
          <input
            id="maxWrongGuesses"
            type="range"
            min="1"
            max="10"
            value={maxWrongGuesses}
            onChange={(e) => setMaxWrongGuesses(parseInt(e.target.value))}
            style={{ width: '300px', margin: '10px 0' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="wrongGuesses">Wrong Guesses: {wrongGuesses} / {maxWrongGuesses}</label>
          <br />
          <input
            id="wrongGuesses"
            type="range"
            min="0"
            max={maxWrongGuesses}
            value={wrongGuesses}
            onChange={(e) => setWrongGuesses(parseInt(e.target.value))}
            style={{ width: '300px', margin: '10px 0' }}
          />
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          Progress: {Math.round(wrongGuessPercentage * 100)}% ({wrongGuesses}/{maxWrongGuesses})
        </div>
      </div>

      <HangmanStickFigure wrongGuesses={wrongGuesses} maxWrongGuesses={maxWrongGuesses} />

      <div style={{ margin: '20px 0' }}>
        <h3>Body Parts Visibility:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '10px 0' }}>
          {bodyParts.map((part) => {
            const isVisible = wrongGuessPercentage >= part.percentage;
            return (
              <div
                key={part.name}
                style={{
                  padding: '8px',
                  backgroundColor: isVisible ? '#ffebee' : '#f5f5f5',
                  border: `2px solid ${isVisible ? '#f44336' : '#e0e0e0'}`,
                  borderRadius: '4px',
                  fontWeight: isVisible ? 'bold' : 'normal',
                }}
              >
                {part.name} {isVisible ? '✓' : '○'}
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {Math.round(part.percentage * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '20px 0', fontSize: '14px', color: '#666' }}>
        <p>This demonstrates how the hangman stick figure appears based on the percentage of wrong guesses.</p>
        <p>Each body part becomes visible when the corresponding percentage threshold is reached (10% increments).</p>
        <p>You can adjust both the maximum allowed wrong guesses (1-10) and the current wrong guesses to see how the figure changes.</p>
        <p>With 10 body parts, each wrong guess reveals exactly one new body part when max guesses equals 10.</p>
      </div>
    </div>
  );
};
