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
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
      sender: {
        ...message.sender,
        createdAt: message.sender.createdAt.toISOString(),
        updatedAt: message.sender.updatedAt.toISOString(),
        emailVerified: message.sender.emailVerified?.toISOString() || null,
      },
      seen: message.seen.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified?.toISOString() || null,
      }))
    }));
  } catch (error: any) {
    return [];
  }
};

export default getMessages;