import prisma from "@/app/libs/prismadb";

const getMessages = async (
  conversationId: string,
  cursor?: string,
  limit: number = 20
) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      take: limit,
      ...(cursor ? {
        skip: 1,
        cursor: {
          id: cursor,
        }
      } : {}),
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;