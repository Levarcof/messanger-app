import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions as any);

    return res.status(200).json({
      ok: true,
      session: session || null,
      cookies: req.headers.cookie || null,
    });
  } catch (err) {
    console.error('[DebugSession] Error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
