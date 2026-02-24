import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    conversationId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor') || undefined;
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: params.conversationId
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

        return NextResponse.json(messages);
    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES_GET');
        return new NextResponse('Internal Error', { status: 500 });
    }
}
