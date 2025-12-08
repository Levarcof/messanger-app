'use client';

import useActiveList from '../hooks/useActiveList';
import { useEffect, useState } from 'react';

export default function PresenceDebug() {
  const { members } = useActiveList();
  const [connectionState, setConnectionState] = useState<string>('loading');
  const [socketId, setSocketId] = useState<string>('');

  useEffect(() => {
    const checkConnection = () => {
      try {
        const pusher = (window as any).pusherClient;
        if (pusher?.connection) {
          setConnectionState(pusher.connection.state);
          setSocketId(pusher.connection.socket_id?.substring(0, 12) + '...' || 'N/A');
        }
      } catch (e) {
        setConnectionState('error');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: connectionState === 'connected' ? '#e8f5e9' : '#fff3e0',
        border: connectionState === 'connected' ? '2px solid #4caf50' : '2px solid #ff9800',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 9999,
        maxWidth: '420px',
        fontFamily: 'monospace',
        fontSize: '11px',
        maxHeight: '350px',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>
        {connectionState === 'connected' ? '🟢' : '🟠'} PRESENCE DEBUG
      </div>

      <div style={{ marginBottom: '8px', padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div><strong>Connection:</strong> <span style={{ color: connectionState === 'connected' ? 'green' : 'orange' }}>{connectionState}</span></div>
        <div><strong>Socket ID:</strong> {socketId}</div>
      </div>

      <div style={{ marginBottom: '8px', padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Members ({members.length}):</strong>
        {members.length === 0 ? (
          <div style={{ color: 'red', marginTop: '5px' }}>❌ No members - waiting for sync...</div>
        ) : (
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {members.map((m, i) => (
              <li key={m} style={{ color: 'green', marginBottom: '3px' }}>
                {i + 1}. ✅ {m}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666', padding: '5px', background: '#f9f9f9', borderRadius: '4px' }}>
        <strong>Instructions:</strong>
        <div>1. Open another browser tab and login</div>
        <div>2. Members count should increase</div>
        <div>3. Check console for detailed logs</div>
      </div>
    </div>
  );
}
