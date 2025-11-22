import { createFileRoute, Link } from '@tanstack/react-router';
import { useAppSettings } from '@bfg-engine/hooks/stores/use-my-app-settings-store';
import { useUserGameSettings } from '@bfg-engine/hooks/stores/use-user-game-settings-store';
import { useUserGameTableSettings } from '@bfg-engine/hooks/stores/use-user-game-table-settings-store';
import { useGameRegistry } from '@bfg-engine/hooks/games-registry/games-registry-hook';
import { BfgSupportedGameTitle } from '@bfg-engine/models/game-box-definition';
import { type BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-uuids';
import { useHostedGames } from '../../../modules/bfg-engine/src/hooks/stores/hosted-games-store';
import { type HydratedLatestGameSnapshot } from '../../../modules/bfg-engine/src/models/internal/game-room-snapshot-from-tb';
// import { useHostedGames } from '../../../modules/bfg-engine/src/hooks/stores/use-hosted-games-store';

interface SettingsRowProps {
  label: string;
  appValue: string;
  gameValue: string | undefined;
  tableValue: string | undefined;
  effectiveValue: string;
}

const SettingsRow = ({ label, appValue, gameValue, tableValue, effectiveValue }: SettingsRowProps) => {
  return (
    <tr>
      <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>{label}</td>
      <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appValue}</td>
      <td style={{ 
        padding: '8px', 
        border: '1px solid #ddd', 
        textAlign: 'center',
        backgroundColor: gameValue ? '#fffbcc' : 'transparent',
        fontWeight: gameValue ? 'bold' : 'normal'
      }}>
        {gameValue ?? '(inherited)'}
      </td>
      <td style={{ 
        padding: '8px', 
        border: '1px solid #ddd', 
        textAlign: 'center',
        backgroundColor: tableValue ? '#ccf2ff' : 'transparent',
        fontWeight: tableValue ? 'bold' : 'normal'
      }}>
        {tableValue ?? '(inherited)'}
      </td>
      <td style={{ 
        padding: '8px', 
        border: '1px solid #ddd', 
        textAlign: 'center',
        backgroundColor: '#d4edda',
        fontWeight: 'bold'
      }}>
        {effectiveValue}
      </td>
    </tr>
  );
};

interface GameSettingsViewProps {
  gameTitle: BfgSupportedGameTitle;
}

const GameSettingsView = ({ gameTitle }: GameSettingsViewProps) => {
  const appSettings = useAppSettings();
  const gameSettings = useUserGameSettings(gameTitle);

  // Calculate effective values at game level
  const effectiveGameSpineLocation = gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation;
  const effectiveGameLogPanelLocation = gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation;
  const effectivePlayerAgentMode = gameSettings.playerAgentMode;

  return (
    <div style={{ marginBottom: '24px', border: '2px solid #ffc107', padding: '16px', borderRadius: '8px', backgroundColor: '#fffef7' }}>
      <h3 style={{ marginTop: 0 }}>
        {gameTitle} (Game-Level Settings)
      </h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#fff9e6' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Setting</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>App Settings</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Game Settings<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>({gameTitle})</span></th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Effective Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Game Spine Location</td>
            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.gameSpineLocation}</td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: gameSettings.gameSpineLocation ? '#fffbcc' : 'transparent',
              fontWeight: gameSettings.gameSpineLocation ? 'bold' : 'normal'
            }}>
              {gameSettings.gameSpineLocation ?? '(inherited)'}
            </td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: '#d4edda',
              fontWeight: 'bold'
            }}>
              {effectiveGameSpineLocation}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Game Log Panel Location</td>
            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.gameLogPanelLocation}</td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: gameSettings.gameLogPanelLocation ? '#fffbcc' : 'transparent',
              fontWeight: gameSettings.gameLogPanelLocation ? 'bold' : 'normal'
            }}>
              {gameSettings.gameLogPanelLocation ?? '(inherited)'}
            </td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: '#d4edda',
              fontWeight: 'bold'
            }}>
              {effectiveGameLogPanelLocation}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Player Agent Mode</td>
            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.playerAgentMode}</td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: gameSettings.playerAgentMode ? '#fffbcc' : 'transparent',
              fontWeight: gameSettings.playerAgentMode ? 'bold' : 'normal'
            }}>
              {gameSettings.playerAgentMode ?? '(inherited)'}
            </td>
            <td style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              textAlign: 'center',
              backgroundColor: '#d4edda',
              fontWeight: 'bold'
            }}>
              {effectivePlayerAgentMode}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface GameTableSettingsViewProps {
  gameTableId: BfgGameTableId;
  gameTitle: BfgSupportedGameTitle;
  tableName: string | null;
}

const GameTableSettingsView = ({ gameTableId, gameTitle, tableName }: GameTableSettingsViewProps) => {
  const appSettings = useAppSettings();
  const gameSettings = useUserGameSettings(gameTitle);
  const tableSettings = useUserGameTableSettings(gameTableId);

  // Calculate effective values
  const effectiveGameSpineLocation = tableSettings.gameSpineLocation ?? gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation;
  const effectiveGameLogPanelLocation = tableSettings.gameLogPanelLocation ?? gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation;
  const effectivePlayerAgentMode = tableSettings.playerAgentMode;

  return (
    <div style={{ marginBottom: '32px', border: '2px solid #333', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>
          {gameTitle} - {tableName || gameTableId}
        </h3>
        <Link
          to="/games/$role/$tableId"
          params={{ role: 'play', tableId: gameTableId }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          🎮 Open Game
        </Link>
      </div>
      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 16px 0' }}>
        Table ID: <code>{gameTableId}</code>
      </p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Setting</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>App Settings</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Game Settings<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>({gameTitle})</span></th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Table Settings<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>(this table)</span></th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Effective Value</th>
          </tr>
        </thead>
        <tbody>
          <SettingsRow
            label="Game Spine Location"
            appValue={appSettings.gameSpineLocation}
            gameValue={gameSettings.gameSpineLocation}
            tableValue={tableSettings.gameSpineLocation}
            effectiveValue={effectiveGameSpineLocation}
          />
          <SettingsRow
            label="Game Log Panel Location"
            appValue={appSettings.gameLogPanelLocation}
            gameValue={gameSettings.gameLogPanelLocation}
            tableValue={tableSettings.gameLogPanelLocation}
            effectiveValue={effectiveGameLogPanelLocation}
          />
          <SettingsRow
            label="Player Agent Mode"
            appValue={appSettings.playerAgentMode}
            gameValue={gameSettings.playerAgentMode ?? undefined}
            tableValue={tableSettings.playerAgentMode}
            effectiveValue={effectivePlayerAgentMode}
          />
        </tbody>
      </table>
    </div>
  );
};

function GameSettingsDebugPage() {
  const hostedGames = useHostedGames();
  const appSettings = useAppSettings();
  const gameRegistry = useGameRegistry();
  const allGameTitles = gameRegistry.getAvailableGameTitles();

  // Group tables by game title
  const tablesByGame = hostedGames.reduce((acc: Record<BfgSupportedGameTitle, HydratedLatestGameSnapshot[]>, table: HydratedLatestGameSnapshot) => {
    const gameTitle = table.gameRoom.gameTitle;
    if (!acc[gameTitle]) {
      acc[gameTitle] = [];
    }
    acc[gameTitle].push(table);
    return acc;
  }, {} as Record<BfgSupportedGameTitle, HydratedLatestGameSnapshot[]>);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Game Settings Debug View</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        This page shows the settings inheritance chain for all games and game tables.
        <br />
        <strong>Yellow background</strong> = Game-level override, <strong>Blue background</strong> = Table-level override, <strong>Green background</strong> = Effective value
      </p>

      <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Global App Settings</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Setting</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Game Spine Location</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.gameSpineLocation}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Game Log Panel Location</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.gameLogPanelLocation}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Player Agent Mode</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{appSettings.playerAgentMode}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Game Settings by Game Type</h2>
      
      {allGameTitles.map((gameTitle: BfgSupportedGameTitle) => {
        const tablesForGame = tablesByGame[gameTitle] || [];
        
        return (
          <div key={gameTitle} style={{ marginBottom: '48px' }}>
            <GameSettingsView gameTitle={gameTitle} />
            
            {tablesForGame.length > 0 && (
              <div style={{ marginLeft: '24px', marginTop: '16px' }}>
                <h4 style={{ marginBottom: '16px', color: '#666' }}>
                  Tables for {gameTitle} ({tablesForGame.length})
                </h4>
                {tablesForGame.map((gameTable: HydratedLatestGameSnapshot) => (
                  <GameTableSettingsView
                    key={gameTable.gameRoom.gameTableId}
                    gameTableId={gameTable.gameRoom.gameTableId}
                    gameTitle={gameTable.gameRoom.gameTitle}
                    tableName={gameTable.gameRoom.tableName}
                  />
                ))}
              </div>
            )}
            
            {tablesForGame.length === 0 && (
              <div style={{ marginLeft: '24px', marginTop: '8px', color: '#999', fontStyle: 'italic' }}>
                No active tables for this game
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: '48px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Legend</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>(inherited)</strong> - Value is not set at this level, inherited from parent level</li>
          <li><strong style={{ backgroundColor: '#fffbcc', padding: '2px 8px' }}>Yellow</strong> - Game-specific override (affects all tables for this game)</li>
          <li><strong style={{ backgroundColor: '#ccf2ff', padding: '2px 8px' }}>Blue</strong> - Table-specific override (affects only this table)</li>
          <li><strong style={{ backgroundColor: '#d4edda', padding: '2px 8px' }}>Green</strong> - Effective value (what's actually used by the UI)</li>
        </ul>
        
        <h4>Inheritance Chain:</h4>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', backgroundColor: 'white', padding: '12px', borderRadius: '4px' }}>
          App Settings (base) → Game Settings (overrides app) → Table Settings (overrides game)
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/dev/game-settings')({
  component: GameSettingsDebugPage,
});

