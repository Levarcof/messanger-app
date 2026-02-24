'use client';

import useActiveList from '../hooks/useActiveList';
import { useEffect, useState } from 'react';
import { pusherClient } from '../libs/pusher';

export default function PresenceDebug() {
  const { members } = useActiveList();
  const [connectionState, setConnectionState] = useState<string>('loading');
  const [socketId, setSocketId] = useState<string>('');
  const [lastAuth, setLastAuth] = useState<any>(null);
  const [serverSession, setServerSession] = useState<any>(null);
  const [channelMembers, setChannelMembers] = useState<string[]>([]);
  const readLastAuth = () => {
    try {
      setLastAuth((window as any).__LAST_PUSHER_AUTH || null);
    } catch (e) {
      setLastAuth(null);
    }
  };

  const readChannelMembers = () => {
    try {
      const ch: any = pusherClient.channel('presence-messenger');
      const list: string[] = [];
      if (ch?.members?.members) {
        // ch.members.members is a Map of members indexed by user_id
        ch.members.members.forEach((m: any) => {
          if (m?.id) list.push(m.id);
        });
      }
      console.log('[Debug] Channel members raw:', ch?.members?.members, 'Normalized:', list);
      setChannelMembers(Array.from(new Set(list)));
    } catch (e) {
      console.error('[Debug] readChannelMembers error:', e);
      setChannelMembers([]);
    }
  };

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
    readLastAuth();
    readChannelMembers();
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

      <div style={{ marginBottom: '8px', padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Channel Members (direct):</strong>
        {channelMembers.length === 0 ? (
          <div style={{ color: 'red', marginTop: '5px' }}>No channel members read from pusher client</div>
        ) : (
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {channelMembers.map((m, i) => (
              <li key={m} style={{ color: 'blue', marginBottom: '3px' }}>{i + 1}. {m}</li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '6px' }}>
          <button onClick={() => { setServerSession(null); fetch('/api/debug/session', { credentials: 'include' }).then(r=>r.json()).then(setServerSession).catch(e=>setServerSession({error: String(e)})); }} style={{ marginRight: 8 }}>Fetch server session</button>
          <button onClick={() => {
            setLastAuth((window as any).__LAST_PUSHER_AUTH || null);
            readChannelMembers();

            try {
              // Force a re-subscribe to trigger the auth flow again
              pusherClient.unsubscribe('presence-messenger');
            } catch (e) {
              /* ignore */
            }

            setTimeout(() => {
              try {
                pusherClient.subscribe('presence-messenger');
                // small delay to allow auth to run
                setTimeout(() => {
                  readLastAuth();
                  readChannelMembers();
                }, 700);
              } catch (e) {
                console.error('Resubscribe error', e);
              }
            }, 300);
          }}>Refresh auth & members</button>
        </div>
      </div>

      <div style={{ marginBottom: '8px', padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Last Pusher Auth:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>{JSON.stringify(lastAuth, null, 2) || 'No auth response yet'}</pre>
      </div>

      <div style={{ marginBottom: '8px', padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Server Session:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>{JSON.stringify(serverSession, null, 2) || 'Not fetched'}</pre>
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
