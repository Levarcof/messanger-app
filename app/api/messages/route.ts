import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

import { rateLimit, rateLimitResponse } from "@/app/libs/rate-limit";

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Rate limiting: 20 messages per minute
    const limitResult = await rateLimit(currentUser.id, 20);
    if (!limitResult.success) {
      return rateLimitResponse();
    }

    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;

    // 1. Generate ID server-side for ultra-fast response
    const { ObjectId } = require('mongodb');
    const newMessageId = new ObjectId().toHexString();

    const newMessage = {
      id: newMessageId,
      body: message,
      image: image,
      createdAt: new Date(),
      seenIds: [currentUser.id],
      senderId: currentUser.id,
      conversationId: conversationId,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
      },
      seen: [{
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
      }]
    };

    // 2. TRIGGER PUSHER IMMEDIATELY (Eliminates DB Save Latency in production)
    const pusherPromise = pusherServer.trigger(conversationId, 'messages:new', newMessage);

    // 3. BACKGROUND PERSISTENCE (Non-blocking)
    const backgroundTask = async () => {
      try {
        await prisma.message.create({
          data: {
            id: newMessageId,
            body: message,
            image: image,
            conversation: { connect: { id: conversationId } },
            sender: { connect: { id: currentUser.id } },
            seen: { connect: { id: currentUser.id } }
          }
        });

        const updatedConversation = await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageAt: new Date(),
            messages: { connect: { id: newMessageId } }
          },
          select: {
            users: { select: { email: true } }
          }
        });

        const userEmails = updatedConversation.users
          .map((user) => user.email)
          .filter((email): email is string => !!email);

        if (userEmails.length > 0) {
          await pusherServer.trigger(userEmails, 'conversation:update', {
            id: conversationId,
            messages: [newMessage]
          });
        }
      } catch (e) {
        console.error("Background persistence error:", e);
      }
    };

    // Fire and forget (or use await/waitUntil depending on infra)
    // Most cloud platforms (Vercel/Next but NOT AWS Lambda without waitUntil) 
    // might kill this, but the Pusher trigger is the critical latency win.
    backgroundTask();

    await pusherPromise;

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse(error?.message || 'InternalError', { status: 500 });
  }
}