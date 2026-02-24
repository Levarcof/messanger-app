import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      select: {
        id: true,
        createdAt: true,
        lastMessageAt: true,
        name: true,
        isGroup: true,
        messagesIds: true,
        userIds: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            body: true,
            image: true,
            createdAt: true,
            seenIds: true,
            senderId: true,
            conversationId: true,
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
            seen: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          }
        }
      }
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;