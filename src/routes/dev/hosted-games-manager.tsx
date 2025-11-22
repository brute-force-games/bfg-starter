import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Table, TableColumn } from '@bfg-engine/ui/bfg-ui/components/Table';
import { Card } from '@bfg-engine/ui/bfg-ui/components/Card';
import { Typography } from '@bfg-engine/ui/bfg-ui/components/Typography';
import { Button } from '@bfg-engine/ui/bfg-ui/components/Button';
import { GameTable } from '@bfg-engine/models/game-table/game-table';
import { type BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-uuids';
// import { useHostedGames } from '../../../modules/bfg-engine/src/hooks/stores/use-hosted-games-store';
import { useHostedGames } from '../../../modules/bfg-engine/src/hooks/stores/hosted-games-store';

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTablePhase = (phase: string): string => {
  // Convert table-phase-game-in-progress to "Game In Progress"
  return phase
    .replace('table-phase-', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const HostedGamesManagerPage = () => {
  const hostedGames = useHostedGames();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = (gameId: BfgGameTableId) => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      setDeletingIds(prev => new Set(prev).add(gameId));
      // const success = deleteHostedGame(gameId);
      const success = false;
      if (!success) {
        alert('Failed to delete game');
      }
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
    }
  };

  const columns: TableColumn<GameTable>[] = [
    {
      key: 'gameTitle',
      label: 'Game Title',
      sortable: true,
      width: '200px',
      render: (gameTitle: string) => (
        <Typography variant="body2" style={{ fontWeight: 500 }}>
          {gameTitle}
        </Typography>
      ),
    },
    {
      key: 'tableName',
      label: 'Table Name',
      sortable: true,
      width: '200px',
      render: (tableName: string, row: GameTable) => (
        <Link
          to="/games/$role/$tableId"
          params={{ role: 'play', tableId: row.id }}
          target="_blank"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {tableName} ↗
        </Link>
      ),
    },
    {
      key: 'id',
      label: 'Game Table ID',
      sortable: true,
      width: '200px',
      render: (id: string) => (
        <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {id}
        </Typography>
      ),
    },
    {
      key: 'createdAt',
      label: 'Time Created',
      sortable: true,
      width: '180px',
      render: (createdAt: number) => (
        <Typography variant="caption" color="secondary">
          {formatTimestamp(createdAt)}
        </Typography>
      ),
    },
    {
      key: 'tablePhase',
      label: 'Status',
      sortable: true,
      width: '200px',
      render: (tablePhase: string) => (
        <Typography 
          variant="body2" 
          style={{ 
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: tablePhase.includes('complete') ? '#e8f5e9' :
                           tablePhase.includes('progress') ? '#fff3e0' :
                           tablePhase.includes('abandoned') || tablePhase.includes('error') ? '#ffebee' :
                           '#e3f2fd',
            color: tablePhase.includes('complete') ? '#2e7d32' :
                   tablePhase.includes('progress') ? '#ef6c00' :
                   tablePhase.includes('abandoned') || tablePhase.includes('error') ? '#c62828' :
                   '#1565c0',
            display: 'inline-block',
            fontWeight: 500,
          }}
        >
          {formatTablePhase(tablePhase)}
        </Typography>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      width: '120px',
      align: 'center',
      render: (id: string) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(id as BfgGameTableId)}
          disabled={deletingIds.has(id)}
          style={{ minWidth: '80px' }}
        >
          {deletingIds.has(id) ? 'Deleting...' : 'Delete'}
        </Button>
      ),
    },
  ];

  const data = hostedGames.map(game => ({
    id: game.gameRoom.id,
    createdAt: game.gameRoom.createdAt,
    lastUpdatedAt: game.gameRoom.lastUpdatedAt,
  }));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px' }}>Hosted Games Manager</h1>
        <Typography variant="body2" color="secondary">
          View and manage your hosted games. This is a development tool for debugging and testing.
        </Typography>
      </div>

      <Card>
        <div style={{ padding: '16px' }}>
          <Typography variant="body2" color="secondary" style={{ marginBottom: '16px' }}>
            {hostedGames.length} game{hostedGames.length !== 1 ? 's' : ''} hosted
          </Typography>
          <Table
            columns={columns}
            data={data}
            defaultSort={{ column: 'createdAt', direction: 'desc' }}
            emptyMessage="No hosted games found. Create a game to see it here."
          />
        </div>
      </Card>

      <div 
        style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px', 
          border: '1px solid #ffc107' 
        }}
      >
        <h4 style={{ marginTop: 0, color: '#856404' }}>⚠️ Development Tool</h4>
        <p style={{ margin: 0, color: '#856404' }}>
          This is a development tool for managing hosted games. Deleted games cannot be recovered.
        </p>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/dev/hosted-games-manager')({
  component: HostedGamesManagerPage,
});

