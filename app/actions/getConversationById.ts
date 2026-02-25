import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null;
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!conversation) {
            return null;
        }

        return {
            ...conversation,
            createdAt: conversation.createdAt.toISOString(),
            lastMessageAt: conversation.lastMessageAt?.toISOString() || null,
            users: conversation.users.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                emailVerified: user.emailVerified?.toISOString() || null,
            }))
        };
    } catch (error: any) {
        return null;
    }
};

export default getConversationById;