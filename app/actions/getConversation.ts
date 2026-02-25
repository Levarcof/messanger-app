import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversationType } from "@/app/types";

const getConversation = async (): Promise<FullConversationType[]> => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      where: {
        userIds: { has: currentUser.id },
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations.map((conversation) => ({
      id: conversation.id,
      createdAt: conversation.createdAt.toISOString(),
      lastMessageAt: conversation.lastMessageAt
        ? conversation.lastMessageAt.toISOString()
        : null,
      name: conversation.name,
      isGroup: conversation.isGroup,
      messagesIds: conversation.messagesIds,
      userIds: conversation.userIds,
      users: conversation.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified
          ? user.emailVerified.toISOString()
          : null,
        conversationIds: user.conversationIds,
        seenMessageIds: user.seenMessageIds,
      })),
      messages: conversation.messages.map((message) => ({
        id: message.id,
        body: message.body,
        image: message.image,
        createdAt: message.createdAt.toISOString(),
        seenIds: message.seenIds,
        senderId: message.senderId,
        conversationId: message.conversationId,
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          email: message.sender.email,
          image: message.sender.image,
          createdAt: message.sender.createdAt.toISOString(),
          updatedAt: message.sender.updatedAt.toISOString(),
          emailVerified: message.sender.emailVerified
            ? message.sender.emailVerified.toISOString()
            : null,
          conversationIds: message.sender.conversationIds,
          seenMessageIds: message.sender.seenMessageIds,
        },
        seen: message.seen.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          emailVerified: user.emailVerified
            ? user.emailVerified.toISOString()
            : null,
          conversationIds: user.conversationIds,
          seenMessageIds: user.seenMessageIds,
        })),
      })),
    }));
  } catch {
    return [];
  }
};

export default getConversation;