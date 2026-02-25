import { Conversation, Message, User } from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt?: Date;
};

export type FullMessageType = Omit<Message, 'sender' | 'seen'> & {
  sender: SafeUser,
  seen: SafeUser[]
};

export type FullConversationType = Omit<Conversation, 'users' | 'messages'> & {
  users: SafeUser[],
  messages?: FullMessageType[],
};