"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import { FullConversationType } from "@/app/types";

import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
  conversation: FullConversationType
};

const Header: React.FC<HeaderProps> = ({
  conversation
}) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          bg-[#0b1120]/40
          backdrop-blur-xl
          w-full
          flex
          border-b
          border-white/5
          sm:px-4
          py-3
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-lg
          z-10
        "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
              lg:hidden
              block
              text-blue-500
              hover:text-blue-400
              transition-colors
              cursor-pointer
            "
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div className="text-white font-bold tracking-tight">
              {conversation.name || otherUser?.name || 'Chat'}
            </div>
            <div
              className="
                text-xs
                font-medium
                text-gray-400
                flex
                items-center
                gap-1.5
              "
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
              {statusText}
            </div>
          </div>
        </div>
        <div
          onClick={() => setDrawerOpen(true)}
          className="
            p-2
            rounded-full
            hover:bg-blue-600/10
            text-blue-500
            hover:text-blue-400
            transition-all
            cursor-pointer
          "
        >
          <HiEllipsisHorizontal size={28} />
        </div>
      </div>
    </>
  );
}

export default Header;