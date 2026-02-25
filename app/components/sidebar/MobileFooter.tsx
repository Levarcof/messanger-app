"use client";

import { SafeUser } from "@/app/types";

interface MobileFooterProps {
  currentUser: SafeUser;
}

const MobileFooter: React.FC<MobileFooterProps> = ({
  currentUser,
}) => {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t p-3 lg:hidden">
      <div className="text-center text-sm">
        {currentUser?.email}
      </div>
    </div>
  );
};

export default MobileFooter;