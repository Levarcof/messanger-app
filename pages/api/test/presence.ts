import { NextApiRequest, NextApiResponse } from 'next';
import { pusherServer } from '@/app/libs/pusher';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * GET /api/test/presence
 * Returns list of users currently on the presence-messenger channel (from Pusher)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    // Get presence info from Pusher server API
    const presenceInfo: any = await new Promise((resolve, reject) => {
      (pusherServer as any).get(
        { path: '/channels/presence-messenger/users' },
        (err: any, req: any, res: any) => {
          if (err) return reject(err);
          let body = '';
          res.on('data', (chunk: any) => body += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve({ raw: body });
            }
          });
        }
      );
    });

    return res.status(200).json({
      ok: true,
      currentUser: (session as any)?.user?.id,
      channel: 'presence-messenger',
      users: presenceInfo?.users || [],
      count: presenceInfo?.users?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Test Presence] Error:', error);
    return res.status(500).json({ ok: false, error: String(error) });
  }
}
