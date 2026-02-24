import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
    const currentUser = await getCurrentUser();
    try {
        if (!currentUser?.email) {
            return null;
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
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
                }
            }
        });
        return conversation;

    }
    catch (error: any) {
        return null;
    }



};

export default getConversationById;