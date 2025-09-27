import { LobbyOptions } from "~/models/p2p-lobby"
import { BfgSupportedGameTitles, BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games";


interface ILobbyHostOptionsComponentProps {
  lobbyOptions: LobbyOptions
  setLobbyOptions: (lobbyOptions: LobbyOptions) => void
}

export const LobbyHostOptionsComponent = ({
  lobbyOptions,
  setLobbyOptions,
}: ILobbyHostOptionsComponentProps) => {

  const allGameChoices = BfgSupportedGameTitlesSchema.options;
  // const availableGameChoices = allGameChoices.filter(choice => !lobbyOptions.gameChoices.includes(choice));

  const enableGameChoice = (gameChoice: BfgSupportedGameTitles) => {
    setLobbyOptions({
      ...lobbyOptions,
      gameChoices: [...lobbyOptions.gameChoices, gameChoice],
    });
  }

  const disableGameChoice = (gameChoice: BfgSupportedGameTitles) => {
    setLobbyOptions({
      ...lobbyOptions,
      gameChoices: lobbyOptions.gameChoices.filter(choice => choice !== gameChoice),
    });
  }

  // console.log('availableGameChoices', availableGameChoices);

  return (
    <div>
      <div>
        <h2>Game Choices ({lobbyOptions.gameChoices.length} selected)</h2>
        <div>
          {allGameChoices.map(choice => {
            const isSelected = lobbyOptions.gameChoices.includes(choice);
            return (
              <div key={choice} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  id={`game-choice-${choice}`}
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      disableGameChoice(choice);
                    } else {
                      enableGameChoice(choice);
                    }
                  }}
                />
                <label htmlFor={`game-choice-${choice}`} style={{ cursor: 'pointer' }}>
                  {choice}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
