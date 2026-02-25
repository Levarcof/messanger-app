import { User, Conversation, Message } from "@prisma/client";

/**
 * Safe user for frontend (no password)
 */
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified" | "hashedPassword"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

/**
 * Message with sender & seen users
 */
export type FullMessageType = Omit<Message, "createdAt"> & {
  createdAt: string;
  sender: SafeUser;
  seen: SafeUser[];
};

/**
 * Conversation with users & messages
 */
export type FullConversationType = Omit<
  Conversation,
  "createdAt" | "lastMessageAt"
> & {
  createdAt: string;
  lastMessageAt: string | null;
  users: SafeUser[];
  messages: FullMessageType[];
};