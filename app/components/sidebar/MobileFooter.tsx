"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { User } from "@prisma/client";
import MobileItem from "./MobileItem";
import { useState } from "react";
import Avatar from "../Avatar";
import { SafeUser } from "@/app/types";

interface MobileFooterProps {
  currentUser: SafeUser
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
        bg-black/80
        backdrop-blur-2xl
        border-t
        border-white/5
        shadow-premium
        lg:hidden
        safe-bottom
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
              px-6
              py-3
              cursor-pointer
              transition-all
              duration-300
              hover:bg-wine-500/5
              active:scale-95
            "
        >
          <Avatar user={currentUser} />
        </div>
      </div>


    </>
  );
}

export default MobileFooter;