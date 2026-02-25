"use client";

import React, { memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = memo(({
  data,
  selected
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray
      .filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(`
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3.5
        rounded-2xl
        transition-all
        duration-300
        cursor-pointer
        group
      `,
        selected ? 'bg-blue-600/10 shadow-blue-glow ring-1 ring-blue-500/20' : 'bg-transparent hover:bg-slate-900/50'
      )}
    >
      {selected && <div className="active-marker" />}
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-0.5
            "
          >
            <p
              className={clsx(`
                text-base
                font-semibold
                transition-colors
              `,
                selected ? 'text-white' : 'text-neutral-200 group-hover:text-blue-500'
              )}
            >
              {data.name || otherUser?.name || 'Chat'}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-[11px]
                  text-gray-500
                  font-medium
                "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p
              className={clsx(`
                truncate
                text-sm
                transition-colors
              `,
                hasSeen ? 'text-gray-500' : 'text-white font-bold'
              )}
            >
              {lastMessageText}
            </p>
            {!hasSeen && (
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 blue-glow" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConversationBox;