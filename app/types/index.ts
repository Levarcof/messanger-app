import { User, Conversation, Message } from "@prisma/client";

/**
 * Safe user for frontend (no password)
 */
export type SafeUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  conversationIds: string[];
  seenMessageIds: string[];
};

/**
 * Message with sender & seen users
 */
export type FullMessageType = {
  id: string;
  body: string | null;
  image: string | null;
  createdAt: string;
  seenIds: string[];
  senderId: string;
  conversationId: string;
  sender: SafeUser;
  seen: SafeUser[];
};

/**
 * Conversation with users & messages
 */
export type FullConversationType = {
  id: string;
  createdAt: string;
  lastMessageAt: string | null;
  name: string | null;
  isGroup: boolean | null;
  messagesIds: string[];
  userIds: string[];
  users: SafeUser[];
  messages: FullMessageType[];
};