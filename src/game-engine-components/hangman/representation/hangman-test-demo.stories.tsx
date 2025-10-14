// import type { Meta, StoryObj } from '@storybook/react';
// import { HangmanTestDemo } from './hangman-test-demo';
// import { HangmanStickFigure } from './hangman-stick-figure';

// const meta: Meta<typeof HangmanTestDemo> = {
//   title: 'Game Components/Hangman',
//   component: HangmanTestDemo,
//   parameters: {
//     layout: 'centered',
//     docs: {
//       description: {
//         component: 'Interactive hangman stick figure component with percentage-based visibility control. Body parts become visible based on the ratio of wrong guesses to maximum allowed wrong guesses (1-10). Each body part represents 10% of the total figure, allowing for 10 distinct views.',
//       },
//     },
//   },
//   tags: ['autodocs'],
// };

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const InteractiveDemo: Story = {
//   name: 'Interactive Hangman Demo',
//   parameters: {
//     docs: {
//       description: {
//         story: 'Interactive demo showing the hangman stick figure with percentage-based visibility. Adjust both the maximum wrong guesses (1-10) and current wrong guesses to see how the figure changes based on the percentage ratio.',
//       },
//     },
//   },
// };

// export const ZeroGuesses: Story = {
//   name: 'No Wrong Guesses (0%)',
//   render: () => {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h3>Hangman - No Wrong Guesses (0%)</h3>
//         <p>Only the gallows is visible. The stick figure appears as the percentage of wrong guesses increases.</p>
//         <HangmanStickFigure wrongGuesses={0} maxWrongGuesses={6} />
//       </div>
//     );
//   },
// };

// export const ThreeGuesses: Story = {
//   name: 'Three Wrong Guesses (30%)',
//   render: () => {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h3>Hangman - Three Wrong Guesses (30%)</h3>
//         <p>Head, neck, and body are visible. Arms, hands, legs, and feet are still hidden.</p>
//         <HangmanStickFigure wrongGuesses={3} maxWrongGuesses={10} />
//       </div>
//     );
//   },
// };

// export const CompleteFigure: Story = {
//   name: 'Complete Stick Figure (100%)',
//   render: () => {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h3>Hangman - Complete Figure (100%)</h3>
//         <p>All 10 body parts are visible. This represents 100% of the maximum wrong guesses allowed.</p>
//         <HangmanStickFigure wrongGuesses={10} maxWrongGuesses={10} />
//       </div>
//     );
//   },
// };

// export const DifferentMaxGuesses: Story = {
//   name: 'Different Max Wrong Guesses',
//   render: () => {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h3>Different Max Wrong Guesses Examples</h3>
//         <p>Same number of wrong guesses (2) with different maximum allowed guesses shows different percentages.</p>
        
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', margin: '20px 0' }}>
//           <div>
//             <h4>Max 3 Guesses (67%)</h4>
//             <p>2 wrong guesses out of 3 max = 67%</p>
//             <p>Shows: Head, neck, body, left arm, right arm, left hand, right hand</p>
//             <HangmanStickFigure wrongGuesses={2} maxWrongGuesses={3} />
//           </div>
          
//           <div>
//             <h4>Max 10 Guesses (20%)</h4>
//             <p>2 wrong guesses out of 10 max = 20%</p>
//             <p>Shows: Head, neck</p>
//             <HangmanStickFigure wrongGuesses={2} maxWrongGuesses={10} />
//           </div>
//         </div>
//       </div>
//     );
//   },
// };