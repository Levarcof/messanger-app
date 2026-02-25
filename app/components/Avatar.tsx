'use client';

import React, { memo } from 'react';
import Image from "next/image";
import { User } from "@prisma/client";
import { SafeUser } from "@/app/types";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User | SafeUser
}

const Avatar: React.FC<AvatarProps> = memo(({
  user
}) => {
  const isActive = useActiveList((state) =>
    user?.id ? state.members.includes(user.id) : false
  );

  return (
    <div className="relative inline-block rounded-full group">
      <div className="
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9 
        md:h-11 
        md:w-11
        shadow-soft
        transition-all
        duration-300
        group-hover:shadow-premium
      ">
        <Image
          fill
          src={user?.image || '/images/placeholder.jpg'}
          alt="Avatar"
          className="object-cover"
        />
      </div>
      {isActive && (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-emerald-500 
            ring-2 
            ring-[#0a0a0a] 
            top-0 
            right-0
            h-2.5 
            w-2.5 
            md:h-3 
            md:w-3
            shadow-[0_0_10px_rgba(16,185,129,0.5)]
          "
        />
      )}
    </div>
  );
});

export default Avatar;