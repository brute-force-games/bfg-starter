import type { Meta, StoryObj } from '@storybook/react';
import { HangmanRepresentation } from './hangman-representation';
import { HangmanGameState, HangmanGameAction } from '~/types/bfg-game-engines/hangman-engine';
import { GameTableSeat } from '~/models/game-table/game-table';

// Helper function to create mock game state
const createMockGameState = (overrides: Partial<HangmanGameState> = {}): HangmanGameState => ({
  isGameOver: false,
  outcomeSummary: undefined,
  numberOfWrongGuesses: 0,
  hiddenWordSetup: null,
  hiddenWordInfo: {
    hiddenWord: 'HANGMAN',
    numberOfWrongGuessesToLose: 6,
  },
  lettersGuessed: [],
  hiddenWordState: '-------',
  playerStates: {
    'p1': { lettersGuessed: [] },
    'p2': { lettersGuessed: [] },
    'p3': { lettersGuessed: [] },
    'p4': { lettersGuessed: [] },
    'p5': { lettersGuessed: [] },
    'p6': { lettersGuessed: [] },
    'p7': { lettersGuessed: [] },
    'p8': { lettersGuessed: [] },
  },
  ...overrides,
});

const createMockAction = (): HangmanGameAction => ({
  actionType: 'game-table-action-player-guess-letter',
  seat: 'p1',
  guess: 'A',
});

const meta: Meta<typeof HangmanRepresentation> = {
  title: 'Game Components/Hangman/Representation',
  component: HangmanRepresentation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The main hangman game representation component used in the actual game. Shows the word state, stick figure, and game status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    myPlayerSeat: {
      control: 'select',
      options: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
      description: 'The current player\'s seat',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GameStart: Story = {
  name: 'Game Start - No Guesses',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      numberOfWrongGuesses: 0,
      lettersGuessed: [],
      hiddenWordState: '-------',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'The game at the very beginning with no letters guessed yet.',
      },
    },
  },
};

export const SomeCorrectGuesses: Story = {
  name: 'Some Correct Guesses',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      numberOfWrongGuesses: 1,
      lettersGuessed: ['A', 'N'],
      hiddenWordState: '-A--A-',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Game in progress with some correct letter guesses. The head is now visible.',
      },
    },
  },
};

export const MultipleWrongGuesses: Story = {
  name: 'Multiple Wrong Guesses',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      numberOfWrongGuesses: 4,
      lettersGuessed: ['A', 'N', 'X', 'Y', 'Z', 'Q'],
      hiddenWordState: '-A--A-',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with several wrong guesses. Head, body, and both arms are now visible.',
      },
    },
  },
};

export const GameWon: Story = {
  name: 'Game Won',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      isGameOver: true,
      outcomeSummary: 'Player p1 won! The word was HANGMAN',
      numberOfWrongGuesses: 2,
      lettersGuessed: ['A', 'N', 'G', 'M', 'H'],
      hiddenWordState: 'HANGMAN',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Game won state with the complete word revealed.',
      },
    },
  },
};

export const GameLost: Story = {
  name: 'Game Lost',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      isGameOver: true,
      outcomeSummary: 'No wrong guesses remaining [out of 6] - final guess was Z.',
      numberOfWrongGuesses: 6,
      lettersGuessed: ['A', 'N', 'X', 'Y', 'Z', 'Q', 'W'],
      hiddenWordState: '-A--A-',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Game lost state with the complete stick figure visible and maximum wrong guesses reached.',
      },
    },
  },
};

export const ShortWord: Story = {
  name: 'Short Word Example',
  args: {
    myPlayerSeat: 'p1' as GameTableSeat,
    gameState: createMockGameState({
      hiddenWordInfo: {
        hiddenWord: 'CAT',
        numberOfWrongGuessesToLose: 4,
      },
      numberOfWrongGuesses: 2,
      lettersGuessed: ['A', 'X', 'Y'],
      hiddenWordState: '-A-',
    }),
    mostRecentAction: createMockAction(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a shorter word and fewer allowed wrong guesses.',
      },
    },
  },
};
