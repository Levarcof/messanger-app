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
    
    if (!session?.user) {
      console.log('[PUSHER-AUTH] ❌ NO SESSION');
      return response.status(401).json({ error: "Unauthorized" });
    }

    const userId = (session.user as any).id;
    const userEmail = (session.user as any).email;

    console.log('[PUSHER-AUTH] User ID:', userId);
    console.log('[PUSHER-AUTH] User Email:', userEmail);

    if (!userId) {
      console.error("[PUSHER] Cannot determine user ID");
      return response.status(401).json({ error: "No user ID" });
    }

    const socketId = request.body?.socket_id;
    const channel = request.body?.channel_name;

    console.log("[PUSHER] Authorizing:", { userId, channel: channel });

    const authData = {
      user_id: userId,
      user_info: {
        email: userEmail,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, authData);
    console.log("[PUSHER] Auth success for user:", userId);
    return response.status(200).json(authResponse);
  } catch (error) {
    console.error("[PUSHER] Auth error:", error);
    return response.status(500).json({ error: "Auth failed" });
  }
}

