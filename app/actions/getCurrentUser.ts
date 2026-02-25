import prisma from "@/app/libs/prismadb";
import { cache } from "react";
import getSession from "./getSession";
import { SafeUser } from "@/app/types";

const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return null;

    return {
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
    };
  } catch {
    return null;
  }
});

export default getCurrentUser;