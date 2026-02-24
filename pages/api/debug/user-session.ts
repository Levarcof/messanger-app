import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  console.log('\n=== SESSION DEBUG ===');
  console.log('Session:', JSON.stringify(session, null, 2));
  console.log('User:', JSON.stringify(session?.user, null, 2));
  console.log('User ID:', (session?.user as any)?.id);
  console.log('================\n');

  return res.json({
    session,
    user: session?.user,
    userId: (session?.user as any)?.id,
    hasId: !!(session?.user as any)?.id
  });
}
