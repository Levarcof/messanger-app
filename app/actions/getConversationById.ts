import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
    const currentUser = await getCurrentUser();
    try {
        if (!currentUser?.email) {
            return null;
        }

        const conversation = prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }


        });
        return conversation;

    }
    catch (error : any){
        return null;
    }
        
    

};

export default getConversationById;