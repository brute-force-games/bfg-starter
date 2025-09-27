import { PublicPlayerProfile } from "~/models/public-player-profile"
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


interface IPeerProfilesComponentProps {
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
}


const PeerProfileCard = ({ peerProfile }: { peerProfile: PublicPlayerProfile }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (handle: string) => {
    return handle.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minWidth: '280px',
      maxWidth: '320px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}>
      {/* Header with avatar and handle */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginRight: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {peerProfile.avatarImageUrl ? (
            <img 
              src={peerProfile.avatarImageUrl} 
              alt={`${peerProfile.handle} avatar`}
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }}
            />
          ) : (
            getInitials(peerProfile.handle)
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {peerProfile.handle}
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '2px'
          }}>
            Peer Profile
          </div>
        </div>
      </div>
      
      {/* Profile details */}
      <div style={{ 
        fontSize: '14px', 
        color: '#666', 
        marginBottom: '16px',
        lineHeight: '1.4'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#333' }}>Created:</strong> {formatDate(peerProfile.createdAt)}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#333' }}>Updated:</strong> {formatDate(peerProfile.updatedAt)}
        </div>
        <div style={{ 
          fontSize: '12px',
          color: '#888',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          backgroundColor: '#f8f9fa',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '8px'
        }}>
          <strong>ID:</strong> {peerProfile.id}
        </div>
      </div>
      
      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: '#e8f5e8',
        borderRadius: '6px',
        border: '1px solid #c3e6cb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#28a745',
            marginRight: '8px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#155724', fontWeight: '500' }}>
            Connected
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#155724' }}>
          🔐 Verified
        </div>
      </div>
    </div>
  );
};

export const PeerProfilesComponent = ({ peerProfiles }: IPeerProfilesComponentProps) => {
  const peerProfileEntries = Array.from(peerProfiles.entries());
  const hasPeers = peerProfileEntries.length > 0;

  if (!hasPeers) {
    return (
      <div style={{ 
        padding: '40px 20px',
        textAlign: 'center',
        color: '#666'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5
        }}>
          👥
        </div>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '18px',
          color: '#333'
        }}>
          No peers connected
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: '14px',
          color: '#666'
        }}>
          Waiting for other players to join...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: '600',
          color: '#333'
        }}>
          Connected Peers ({peerProfileEntries.length})
        </h2>
        <div style={{
          fontSize: '14px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          padding: '6px 12px',
          borderRadius: '16px',
          border: '1px solid #e9ecef'
        }}>
          P2P Network
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}>
        {peerProfileEntries.map(([peerId, peerProfile]) => (
          <PeerProfileCard 
            key={peerId} 
            peerProfile={peerProfile} 
          />
        ))}
      </div>
    </div>
  );
};