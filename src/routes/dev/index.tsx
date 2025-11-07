import { createFileRoute, Link } from '@tanstack/react-router';

interface DevToolCardProps {
  title: string;
  description: string;
  path: string;
  icon?: string;
}

const DevToolCard = ({ title, description, path, icon = '🛠️' }: DevToolCardProps) => {
  return (
    <Link
      to={path}
      style={{
        display: 'block',
        padding: '24px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: 'white',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#007bff';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#ddd';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#007bff' }}>{title}</h3>
      <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>{description}</p>
    </Link>
  );
};

function DevToolsIndexPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Developer Tools</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Debug tools and utilities for development and testing
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        <DevToolCard
          title="Game Settings Viewer"
          description="View and debug the complete settings inheritance chain for all games and tables. Shows app, game, and table-level settings."
          path="/dev/game-settings"
          icon="⚙️"
        />

        <DevToolCard
          title="Hosted Games Manager"
          description="View and manage your hosted games. See game details, status, and delete games that are no longer needed."
          path="/dev/hosted-games-manager"
          icon="🎮"
        />

        {/* Placeholder for future dev tools */}
        <div
          style={{
            padding: '24px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>➕</div>
          <p style={{ margin: 0, color: '#999', textAlign: 'center' }}>
            More dev tools coming soon...
          </p>
        </div>
      </div>

      <div style={{ marginTop: '48px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Available Tools</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <Link to="/dev/game-settings" style={{ color: '#007bff', textDecoration: 'none' }}>
              Game Settings Viewer
            </Link>
            {' - '}
            Debug settings inheritance (App → Game → Table)
          </li>
          <li>
            <Link to="/dev/hosted-games-manager" style={{ color: '#007bff', textDecoration: 'none' }}>
              Hosted Games Manager
            </Link>
            {' - '}
            View and manage hosted games with delete functionality
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <h4 style={{ marginTop: 0, color: '#856404' }}>⚠️ Development Only</h4>
        <p style={{ margin: 0, color: '#856404' }}>
          These tools are for development and debugging purposes only. They should not be accessible in production.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/dev/')({
  component: DevToolsIndexPage,
});

