"use client";

import { SafeUser } from "@/app/types";
import UserBox from "./UserBox";

interface UserListProps {
    items: SafeUser[]
};

const UserList: React.FC<UserListProps> = ({
    items
}) => {
    return (
        <aside className="
            fixed 
            inset-y-0 
            pb-20 
            lg:pb-0 
            lg:left-20 
            lg:w-80 
            lg:block 
            overflow-y-auto 
            bg-[#0a0a0a]
            border-r 
            border-white/5 
            block 
            w-full 
            left-0
        ">
            <div className="px-6">
                <div className="flex-col">
                    <div className="
                      text-2xl 
                      font-bold 
                      text-white
                      py-6
                      tracking-tight
                    ">
                        People
                    </div>
                </div>
                <div className="space-y-1">
                    {items.map((item) => (
                        <UserBox
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default UserList;