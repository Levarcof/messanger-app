import { NextApiRequest, NextApiResponse } from 'next';
import { pusherServer } from '@/app/libs/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Query Pusher for presence channel users
    const path = `/channels/presence-messenger/users`;
    // pusherServer.get is available on the pusher server client to call REST endpoints
    // Types may vary by pusher library version, so treat as any
    const result: any = await (pusherServer as any).get({ path });

    // result.users is the usual shape for this endpoint
    return res.status(200).json({ ok: true, channel: 'presence-messenger', users: result?.users ?? result });
  } catch (err) {
    console.error('[Pusher Members] Error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
