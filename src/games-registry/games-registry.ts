import { FlipACoinGameName, TicTacToeGameName } from "~/types/bfg-game-engines/supported-games";
import { AvailableGameTitleChoice, FlipACoinGameDefinition, GameDefinition, TicTacToeGameDefinition } from "~/types/enums/game-shelf";


export const GamesRegistry = new Map<AvailableGameTitleChoice, GameDefinition>();

GamesRegistry.set(TicTacToeGameName, TicTacToeGameDefinition);
GamesRegistry.set(FlipACoinGameName, FlipACoinGameDefinition);

export const getAvailableGameTitles = () => {
  const retVal = Array.from(GamesRegistry.keys());
  retVal.sort();
  return retVal;
}

