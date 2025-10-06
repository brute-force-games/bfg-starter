import { FlipACoinGameName, HangmanGameName, TicTacToeGameName } from "~/types/bfg-game-engines/supported-games";
import { AvailableGameTitleChoice, FlipACoinGameDefinition, HangmanGameDefinition, GameDefinition, TicTacToeGameDefinition } from "~/types/enums/game-shelf";
import { 
  TicTacToeGameMetadata, 
  FlipACoinGameMetadata, 
  HangmanGameMetadata,
  BfgGameEngineMetadata
} from "~/types/bfg-game-engines/bfg-game-engines";

export const GamesRegistry = new Map<AvailableGameTitleChoice, GameDefinition>();

GamesRegistry.set(TicTacToeGameName, TicTacToeGameDefinition);
GamesRegistry.set(FlipACoinGameName, FlipACoinGameDefinition);
GamesRegistry.set(HangmanGameName, HangmanGameDefinition);

// Enhanced registry that includes both definition and processor metadata
export const GamesMetadataRegistry = new Map<AvailableGameTitleChoice, BfgGameEngineMetadata<any, any>>();

GamesMetadataRegistry.set(TicTacToeGameName, TicTacToeGameMetadata);
GamesMetadataRegistry.set(FlipACoinGameName, FlipACoinGameMetadata);
GamesMetadataRegistry.set(HangmanGameName, HangmanGameMetadata);

export const getAvailableGameTitles = () => {
  const retVal = Array.from(GamesRegistry.keys());
  retVal.sort();
  return retVal;
}

export const getGameMetadata = (gameTitle: AvailableGameTitleChoice): BfgGameEngineMetadata<any, any> => {
  const metadata = GamesMetadataRegistry.get(gameTitle);
  if (!metadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return metadata;
}

