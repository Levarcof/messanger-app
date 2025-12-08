import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const session = await getServerSession(request, response, authOptions);
    
    console.log('[Auth] Session:', session?.user?.email ? '✅ Found' : '❌ Not found');

    if (!session?.user?.email) {
      console.log('[Auth] Rejecting - no email in session');
      return response.status(401).json({ error: 'Unauthorized - no session' });
    }

    const socketId = request.body.socket_id;
    const channel = request.body.channel_name;

    console.log('[Auth] Authorizing:', {
      email: session.user.email,
      channel,
      socketId: socketId?.substring(0, 10) + '...'
    });

    const data = {
      user_id: session.user.email,
      user_info: {
        name: session.user.name || session.user.email,
        email: session.user.email
      }
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    console.log('[Auth] Success - returning auth token');
    return response.status(200).json(authResponse);
  } catch (error) {
    console.error('[Auth] Error:', error);
    return response.status(500).json({ error: 'Auth error' });
  }
}

