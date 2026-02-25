import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { SafeUser } from "@/app/types";

const getUsers = async (): Promise<SafeUser[]> => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        NOT: { email: session.user.email },
      },
    });

    return users.map((user) => ({
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
    }));
  } catch (error) {
    return [];
  }
};

export default getUsers;