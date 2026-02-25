
"use client";

import { SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import axios from "axios";

interface UserBoxProps {
  data: SafeUser
}

const UserBox: React.FC<UserBoxProps> = ({
  data
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      userId: data.id
    })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <div
        onClick={handleClick}
        className="
          w-full
          relative
          flex
          items-center
          space-x-3
          p-3.5
          bg-transparent
          hover:bg-slate-900/50
          rounded-2xl
          transition-all
          duration-300
          cursor-pointer
          group
          hover:shadow-premium
          hover:ring-1
          hover:ring-white/5
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <p
                className="
                  text-base
                  font-semibold
                  text-neutral-200
                  group-hover:text-blue-500
                  transition-colors
                "
              >
                {data.name}
              </p>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Start an elegant conversation
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserBox;