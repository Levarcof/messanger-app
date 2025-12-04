"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { User } from "@prisma/client";
import MobileItem from "./MobileItem";
import { useState } from "react";
import Avatar from "../Avatar";
interface MobileFooterProps {
  currentUser: User
}

const MobileFooter: React.FC<MobileFooterProps> = (
  {
    currentUser
  }
) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const [IsOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return null;
  }

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={IsOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
        fixed
        justify-between
        w-full
        bottom-0
        z-40
        flex
        items-center
        bg-white
         border-t-[1px]
        lg:hidden
      "
      >
        {routes.map((route) => (
          <MobileItem
            key={route.href}
            href={route.href}
            active={route.active}
            icon={route.icon}
            onClick={route.onClick}
          />
        ))}

        <div
          onClick={() => setIsOpen(true)}
          className="
              cursor-pointer
              hover:opacity-75
              transition
            "
        >
          <Avatar user={currentUser} />
        </div>
      </div>


    </>
  );
}

export default MobileFooter;