"use client";

import { SafeUser } from "@/app/types";

interface DesktopSidebarProps {
  currentUser: SafeUser;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser,
}) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-20 lg:flex lg:flex-col lg:items-center lg:py-4 lg:border-r bg-white">
      <div className="text-sm font-semibold mt-4">
        {currentUser?.name}
      </div>
    </div>
  );
};

export default DesktopSidebar;