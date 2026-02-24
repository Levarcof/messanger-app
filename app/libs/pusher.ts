import PusherServer from "pusher";
import PusherClient from "pusher-js";

const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || 'ap2';

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: PUSHER_CLUSTER,
  useTLS: true
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: PUSHER_CLUSTER,
    authorizer: (channel, options) => {
      return {
        authorize: (socketId: string, callback: (err: any, auth?: any) => void) => {
          console.log('[🔓 Pusher Client] Requesting auth for channel:', channel.name);
          fetch('/api/pusher/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ socket_id: socketId, channel_name: channel.name })
          })
          .then(async (res) => {
            const text = await res.text();
            if (!res.ok) {
              console.error('[🔓 Pusher Client] Auth FAILED:', res.status, text);
              return callback(new Error(`Auth error: ${res.status}`));
            }
            try {
              const parsed = JSON.parse(text);
              console.log('[🔓 Pusher Client] Auth SUCCESS, user_id:', parsed?.user_id || 'unknown');
              try {
                (window as any).__LAST_PUSHER_AUTH = parsed;
              } catch (e) {}
              callback(null, parsed);
            } catch (e) {
              console.error('[🔓 Pusher Client] Parse error:', e);
              callback(null, text);
            }
          })
          .catch((err) => {
            console.error('[🔓 Pusher Client] Request error:', err);
            callback(err);
          });
        }
      };
    }
  }
);

// Monitor connection state
if (typeof window !== 'undefined') {
  (window as any).pusherClient = pusherClient;

  pusherClient.connection.bind('state_change', (change: any) => {
    console.log(`[Pusher] Connection state: ${change.previous} → ${change.current}`);
  });

  pusherClient.connection.bind('connected', () => {
    console.log('[Pusher] ✅ Connected to Pusher');
  });

  pusherClient.connection.bind('error', (error: any) => {
    console.error('[Pusher] Connection error:', error);
  });

  pusherClient.connection.bind('failed', () => {
    console.error('[Pusher] Connection failed');
  });
}