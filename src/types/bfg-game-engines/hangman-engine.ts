import { z } from "zod";
import { createBfgGameEngineProcessor, IBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { GameTable } from "../../models/game-table/game-table";
import { GameTableActionResult } from "../../models/game-table/table-phase";
import { HangmanGameName } from "./supported-games";
import { GameTableSeatSchema } from "../../models/game-table/game-table";
import { BfgGameSpecificTableAction } from "../../models/game-table/game-table-action";
import { BfgGameTableActionId } from "../core/branded-values/bfg-branded-ids";
import { createHangmanComboRepresentationAndInput, createHangmanHostComponent, createHangmanInput, createHangmanRepresentation } from "~/game-engine-components/hangman/hangman-components";
import { BfgGameEngineRendererFactory } from "./bfg-game-engines";
import { getWordInfoFromInternalWordList } from "./hangman-engine-utils";


export const HangmanResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-player-wins',
  'game-over-failure',
])

export type HangmanResolution = z.infer<typeof HangmanResolutionSchema>;


export const LetterChoiceSchema = z.enum([
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z',
])

export type LetterChoice = z.infer<typeof LetterChoiceSchema>;


// export const HANGMAN_WORD_SOURCE_PLAYER_PICKS = 'hangman-word-source-player-picks' as const;
// export const HANGMAN_WORD_SOURCE_HOST_CHOSES_RANDOM = 'hangman-word-source-host-chooses-random' as const;


export const HANGMAN_GAME_TABLE_ACTION_START_GAME = 'game-table-action-host-start-game' as const;
export const HANGMAN_WORD_SOURCE_NOT_SET = 'hangman-word-source-not-set' as const;
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD = 'game-table-action-player-picks-hidden-word' as const;
export const HANGMAN_GAME_TABLE_ACTION_HOST_CHOOSES_RANDOM_HIDDEN_WORD = 'game-table-action-host-chooses-random-hidden-word' as const;
export const HANGMAN_GAME_TABLE_ACTION_HOST_FINALIZES_HIDDEN_WORD = 'hangman-game-table-action-host-finalizes-hidden-word' as const;
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER = 'game-table-action-player-guess-letter' as const;
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME = 'game-table-action-player-cancel-game' as const;


export const HangmanActionStartGameSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_START_GAME),
})

export type HangmanActionStartGame = z.infer<typeof HangmanActionStartGameSchema>;


// export const HangmanWordSourceNotSetSchema = z.object({
//   actionType: z.literal(HANGMAN_WORD_SOURCE_NOT_SET),
// })

export const HangmanWordSourceNotSetSchema = z.literal(HANGMAN_WORD_SOURCE_NOT_SET)

// export const HangmanHiddenWordSourceSchema = z.enum([
//   'use-horse',
//   'internal-word-list',
// ])
// export type HangmanHiddenWordSource = z.infer<typeof HangmanHiddenWordSourceSchema>;


export const HiddenWordInfoSchema = z.object({
  hiddenWord: z.string(),
  numberOfWrongGuessesToLose: z.number().min(1),
})

export type HiddenWordInfo = z.infer<typeof HiddenWordInfoSchema>;


export const PlayerHiddenWordSubmissionSchema = z.object({
  seat: GameTableSeatSchema,
  info: HiddenWordInfoSchema,
})

export type PlayerHiddenWordSubmission = z.infer<typeof PlayerHiddenWordSubmissionSchema>;


export const HangmanActionPlayerPicksHiddenWordSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD),
  seat: GameTableSeatSchema,
  hiddenWordInfo: HiddenWordInfoSchema,
})

export type HangmanActionPlayerPicksHiddenWord = z.infer<typeof HangmanActionPlayerPicksHiddenWordSchema>;


// export const HangmanActionHostChoosesHiddenWordSourceRandomSchema = z.object({
//   actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_HOST_CHOOSES_RANDOM_HIDDEN_WORD),
//   hiddenWordSource: HangmanHiddenWordSourceSchema,
// })

// export type HangmanActionHostChoosesHiddenWordSourceRandom = z.infer<typeof HangmanActionHostChoosesHiddenWordSourceRandomSchema>;

// export const HangmanActionSetupHiddenWordActionSchema = z.discriminatedUnion('actionType', [
//   HangmanActionPlayerPicksHiddenWordSchema,
//   HangmanActionHostChoosesHiddenWordSourceRandomSchema,
// ])


// export const HangmanActionFinalizeHiddenWordSchema = z.discriminatedUnion('actionType', [
//   HangmanActionPlayerPicksHiddenWordSchema,
//   HangmanActionHostChoosesHiddenWordSourceRandomSchema,
// ])

// export type HangmanActionFinalizeHiddenWord = z.infer<typeof HangmanActionFinalizeHiddenWordSchema>;


export const HangmanActionHostFinalizesHiddenWordActionSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_HOST_FINALIZES_HIDDEN_WORD),
  // finalizedHiddenWordInfo: HiddenWordInfoSchema,
  source: z.discriminatedUnion('source', [
    z.object({
      source: z.literal('player'),
      seat: GameTableSeatSchema,
    }),
    z.object({
      source: z.literal('internal-word-list'),
    }),
  ]),
})

export type HangmanActionHostFinalizesHiddenWordAction = z.infer<typeof HangmanActionHostFinalizesHiddenWordActionSchema>;


export const HangmanActionGuessLetterSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER),
  seat: GameTableSeatSchema,
  guess: LetterChoiceSchema,
})

export type HangmanActionGuessLetter = z.infer<typeof HangmanActionGuessLetterSchema>;


export const HangmanActionCancelGameSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME),
  seat: GameTableSeatSchema,
  cancellationReason: z.string(),
})

export type HangmanActionCancelGame = z.infer<typeof HangmanActionCancelGameSchema>;


export const HangmanGameActionSchema = z.discriminatedUnion('actionType', [
  HangmanActionStartGameSchema,
  HangmanActionPlayerPicksHiddenWordSchema,
  // HangmanActionHostChoosesHiddenWordSourceRandomSchema,
  HangmanActionHostFinalizesHiddenWordActionSchema,
  HangmanActionGuessLetterSchema,
  HangmanActionCancelGameSchema,
])

export type HangmanGameAction = z.infer<typeof HangmanGameActionSchema>;


export const PlayerStateSchema = z.object({
  lettersGuessed: z.array(LetterChoiceSchema),
})


export const HangmanGameStateSchema = z.object({
  isGameOver: z.boolean(),
  outcomeSummary: z.string().optional(),

  numberOfWrongGuesses: z.number(),

  playerHiddenWordSubmissions: z.array(PlayerHiddenWordSubmissionSchema)
    .default([]),

  hiddenWordSource: HangmanActionHostFinalizesHiddenWordActionSchema.nullable(),
  hiddenWordInfo: HiddenWordInfoSchema.nullable(),

  lettersGuessed: z.array(LetterChoiceSchema),
  hiddenWordState: z.string(),
  
  playerStates: z.record(GameTableSeatSchema, PlayerStateSchema)
    .optional()
    .default({
      'p1': { lettersGuessed: [], },
      'p2': { lettersGuessed: [], },
      'p3': { lettersGuessed: [], },
      'p4': { lettersGuessed: [], },
      'p5': { lettersGuessed: [], },
      'p6': { lettersGuessed: [], },
      'p7': { lettersGuessed: [], },
      'p8': { lettersGuessed: [], },
    }),
}).describe('Hangman');

export type HangmanGameState = z.infer<typeof HangmanGameStateSchema>;


const createInitialGameState = (
  initialGameTableAction: HangmanGameAction,
): HangmanGameState => {

  if (initialGameTableAction.actionType !== 'game-table-action-host-start-game') {
    throw new Error("Initial game table action must be a host start game");
  }

  const retVal: HangmanGameState = {
    isGameOver: false,
    outcomeSummary: undefined,
    numberOfWrongGuesses: 0,
    playerHiddenWordSubmissions: [],
    hiddenWordSource: null,
    hiddenWordInfo: null,
    lettersGuessed: [],
    hiddenWordState: '',
    playerStates: {
      'p1': { lettersGuessed: [], },
      'p2': { lettersGuessed: [], },
      'p3': { lettersGuessed: [], },
      'p4': { lettersGuessed: [], },
      'p5': { lettersGuessed: [], },
      'p6': { lettersGuessed: [], },
      'p7': { lettersGuessed: [], },
      'p8': { lettersGuessed: [], },
    },
  };

  return retVal;
}


const createInitialHangmanGameTableAction = (
  // _gameTable: NewGameTable,
): BfgGameSpecificTableAction<HangmanGameAction> => {
  return {
    actionType: 'game-table-action-host-starts-game',
    gameSpecificAction: {
      actionType: HANGMAN_GAME_TABLE_ACTION_START_GAME,
    },
    gameTableActionId: BfgGameTableActionId.createId(),
    source: 'game-table-action-source-host',
  };
}


const _applyPlayerPicksHiddenWordAction = (
  gameState: HangmanGameState,
  gameAction: HangmanActionPlayerPicksHiddenWord,
): GameTableActionResult<HangmanGameState> => {
  
  const hiddenWord = gameAction.hiddenWordInfo.hiddenWord;
  const numberOfWrongGuessesToLose = gameAction.hiddenWordInfo.numberOfWrongGuessesToLose;

  const summary = `Player ${gameAction.seat} chose ${hiddenWord} and set the number of wrong guesses to lose to ${numberOfWrongGuessesToLose}`;

  const updatedPlayerHiddenWordSubmissions = [
    ...gameState.playerHiddenWordSubmissions
      .filter(submission => submission.seat !== gameAction.seat), 
    {
      seat: gameAction.seat,
      info: gameAction.hiddenWordInfo,
    },
  ];

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: {
      ...gameState,
      playerHiddenWordSubmissions: updatedPlayerHiddenWordSubmissions,
    },
    gameSpecificStateSummary: summary,
  }
}


// const _applyHostChoosesHiddenWordSourceRandomAction = (
//   gameState: HangmanGameState,
//   gameAction: HangmanActionHostChoosesHiddenWordSourceRandom,
// ): GameTableActionResult<HangmanGameState> => {
  
//   const getHiddenWordInfo = (source: HangmanHiddenWordSource): HiddenWordInfo => {
//     if (source === 'use-horse') {
//       return {
//         hiddenWord: 'horse',
//         numberOfWrongGuessesToLose: 10,
//       };
//     }
    
//     const wordList = [
//       'mustang',
//       'dog',
//       'cat',
//       'bird',
//       'fish',
//     ];

//     const randomIndex = Math.floor(Math.random() * wordList.length);

//     return {
//       hiddenWord: wordList[randomIndex],
//       numberOfWrongGuessesToLose: 10,
//     };
//   }

//   const { hiddenWord, numberOfWrongGuessesToLose } = getHiddenWordInfo(gameAction.hiddenWordSource);
//   const summary = `Host chose ${hiddenWord} and set the number of wrong guesses to lose to ${numberOfWrongGuessesToLose}`;

//   return {
//     tablePhase: 'table-phase-game-in-progress',
//     gameSpecificState: {
//       ...gameState,
//       hiddenWordSetup: gameAction,
//       // Don't set hiddenWordInfo here - let the finalization action handle it
//     },
//     gameSpecificStateSummary: summary,
//   }
// }


const _applyHostFinalizesHiddenWordAction = (
  gameState: HangmanGameState,
  gameAction: HangmanActionHostFinalizesHiddenWordAction,
): GameTableActionResult<HangmanGameState> => {

  // if (!gameState.hiddenWordSetup) {
  //   return {
  //     tablePhase: 'table-phase-error',
  //     gameSpecificState: gameState,
  //     gameSpecificStateSummary: `Hidden word not set`,
  //   }
  // }

  const getHiddenWordInfo = (): HiddenWordInfo => {

    if (gameAction.source.source === 'player') {
      const playerSource = gameAction.source;
      const playerSeat = playerSource.seat;
      const info = gameState.playerHiddenWordSubmissions.find(submission => 
        submission.seat === playerSeat)?.info;
      if (!info) {
        throw new Error("Player hidden word submission not found");
      }
      return info;
    }

    if (gameAction.source.source === 'internal-word-list') {
      return getWordInfoFromInternalWordList();
    }

    throw new Error(`Invalid hidden word source`);
  }

  const hiddenWordInfo = getHiddenWordInfo();

  const hiddenWord = hiddenWordInfo.hiddenWord.toUpperCase();
  const numberOfWrongGuessesToLose = hiddenWordInfo.numberOfWrongGuessesToLose;
  const summary = `Host finalized ${hiddenWord} as the hidden word and set the number of wrong guesses to lose to ${numberOfWrongGuessesToLose}`;

  const updatedHiddenWordState = "-".repeat(hiddenWord.length);

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: {
      ...gameState,
      hiddenWordInfo: { hiddenWord, numberOfWrongGuessesToLose },
      hiddenWordState: updatedHiddenWordState,
    },
    gameSpecificStateSummary: summary,
  }
}


const _applyPlayerGuessLetterAction = (
  gameState: HangmanGameState,
  gameAction: HangmanActionGuessLetter,
): GameTableActionResult<HangmanGameState> => {

  if (!gameState.hiddenWordInfo) {
    return {
      tablePhase: 'table-phase-error',
      gameSpecificState: gameState,
      gameSpecificStateSummary: `Letter guess not possible - hidden word not set`,
    }
  }

  const { guess } = gameAction;

  // Get all indexes where the guessed letter appears
  const letterGuessIndexes: number[] = [];
  const hiddenWord = gameState.hiddenWordInfo.hiddenWord;
  for (let i = 0; i < hiddenWord.length; i++) {
    if (hiddenWord[i] === guess) {
      letterGuessIndexes.push(i);
    }
  }
  const isGuessWrong = letterGuessIndexes.length === 0;
  const updatedLettersGuessed = [...gameState.lettersGuessed, guess];

  if (isGuessWrong) {
    const numberOfWrongGuesses = gameState.numberOfWrongGuesses + 1;
    const numWrongGuessesRemaining = gameState.hiddenWordInfo.numberOfWrongGuessesToLose - numberOfWrongGuesses;
    const outOfGuesses = numWrongGuessesRemaining <= 0;
  
    if (outOfGuesses) {
      return {
        tablePhase: 'table-phase-game-complete-no-winners',
        gameSpecificState: {
          ...gameState,
          numberOfWrongGuesses,
          lettersGuessed: updatedLettersGuessed,
        },
        gameSpecificStateSummary: `No wrong guesses remaining [out of ${numberOfWrongGuesses}] - final guess was ${guess}.`,
      }
    }

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        numberOfWrongGuesses,
        lettersGuessed: updatedLettersGuessed,
      },
      gameSpecificStateSummary: `Guess ${guess} was wrong - ${numWrongGuessesRemaining} wrong guesses remaining.`,
    }
  }

  // Update the hidden word state with the guessed letter at the correct positions
  const updatedHiddenWordState = gameState.hiddenWordState
    .split('')
    .map((char, index) => letterGuessIndexes.includes(index) ? guess : char)
    .join('');

  const isGameWon = !updatedHiddenWordState.includes('-');

  if (isGameWon) {
    return {
      tablePhase: 'table-phase-game-complete-with-winners',
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: `Player ${gameAction.seat} won! The word was ${hiddenWord}`,
        lettersGuessed: updatedLettersGuessed,
        hiddenWordState: updatedHiddenWordState,
      },
      gameSpecificStateSummary: `Game won! The word was ${hiddenWord}`,
    }
  }

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: {
      ...gameState,
      lettersGuessed: updatedLettersGuessed,
      hiddenWordState: updatedHiddenWordState,
    },
    gameSpecificStateSummary: `Guess ${guess} was correct - current word state is ${updatedHiddenWordState}`,
  }
}


const applyHangmanGameAction = (
  _tableState: GameTable,
  gameState: HangmanGameState,
  gameAction: HangmanGameAction,
): GameTableActionResult<HangmanGameState> => {

  console.log("APPLY HANGMAN GAME ACTION - GAME STATE", gameState);
  console.log("APPLY HANGMAN GAME ACTION - GAME ACTION", gameAction);


  if (gameAction.actionType === HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD) {

    const actionResult = _applyPlayerPicksHiddenWordAction(gameState, gameAction);
    return actionResult;
  } 

  // if (gameAction.actionType === HANGMAN_GAME_TABLE_ACTION_HOST_CHOOSES_RANDOM_HIDDEN_WORD) {

  //   const actionResult = _applyHostChoosesHiddenWordSourceRandomAction(gameState, gameAction);
  //   return actionResult;
  // } 

  if (gameAction.actionType === HANGMAN_GAME_TABLE_ACTION_HOST_FINALIZES_HIDDEN_WORD) {

    const actionResult = _applyHostFinalizesHiddenWordAction(gameState, gameAction);
    return actionResult;
  }

  if (gameAction.actionType === HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER) {

    const actionResult = _applyPlayerGuessLetterAction(gameState, gameAction);
    return actionResult;
  }

  if (gameAction.actionType === HANGMAN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME) {
    return {
      tablePhase: 'table-phase-game-abandoned',
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: gameAction.cancellationReason,
      },
      gameSpecificStateSummary: gameAction.cancellationReason,
    }
  }

  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid game action: ${gameAction.actionType}`,
  };
}


const hangmanRendererFactory: BfgGameEngineRendererFactory<
  typeof HangmanGameStateSchema,
  typeof HangmanGameActionSchema
> = {
  createGameStateHostComponent: createHangmanHostComponent,
  createGameStateRepresentationComponent: createHangmanRepresentation,
  createGameStateActionInputComponent: createHangmanInput,
  createGameStateCombinationRepresentationAndInputComponent: createHangmanComboRepresentationAndInput,
}


const hangmanProcessorImplementation: IBfgGameEngineProcessor<
  typeof HangmanGameStateSchema,
  typeof HangmanGameActionSchema
> = {
  gameTitle: HangmanGameName,
  
  applyGameAction: applyHangmanGameAction,
  createInitialGameSpecificState: createInitialGameState,
  createInitialGameTableAction: createInitialHangmanGameTableAction,

  createGameStateHostComponent: createHangmanHostComponent,
  createGameStateRepresentationComponent: createHangmanRepresentation,
  createGameStateActionInputComponent: createHangmanInput,

  createGameStateCombinationRepresentationAndInputComponent: undefined,
}



export const HangmanGameStateProcessor = createBfgGameEngineProcessor(
  HangmanGameName,
  HangmanGameStateSchema,
  HangmanGameActionSchema,

  hangmanProcessorImplementation,
  hangmanRendererFactory,
);
