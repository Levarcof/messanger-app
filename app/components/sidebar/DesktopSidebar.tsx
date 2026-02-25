'use client';

import { useState } from "react";
import { User } from "@prisma/client";

import useRoutes from "@/app/hooks/useRoutes";

import Avatar from "../Avatar";
import DesktopItem from "./DesktopItem";
import SettingsModal from "./SettingsModal";

import { SafeUser } from "@/app/types";

interface DesktopSidebarProps {
  currentUser: SafeUser
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  console.log({ currentUser })

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="
        hidden 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:w-20 
        xl:px-6 
        lg:overflow-y-auto 
        glass-sidebar
        lg:pb-10 
        lg:flex 
        lg:flex-col 
        justify-between 
        transition-all
      ">
        <nav className="mt-8 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center gap-y-6">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center group">
          <div
            onClick={() => setIsOpen(true)}
            className="
              cursor-pointer 
              transition-all
              duration-300
              hover:scale-110
              relative
            "
          >
            <Avatar user={currentUser} />
            <div className="absolute inset-0 rounded-full ring-2 ring-wine-600/20 group-hover:ring-wine-600/50 transition-all opacity-0 group-hover:opacity-100 wine-glow" />
          </div>
        </nav>
      </div>
    </>
  );
}

export default DesktopSidebar;