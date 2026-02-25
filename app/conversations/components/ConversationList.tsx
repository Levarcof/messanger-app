"use client";

import { SafeUser, FullConversationType } from "@/app/types";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: SafeUser[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 border-r block overflow-y-auto bg-white">
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">
            Messages
          </div>
        </div>

        <div className="space-y-2">
          {initialItems.map((conversation) => (
            <div
              key={conversation.id}
              className="p-3 bg-gray-100 rounded-md"
            >
              {conversation.users.map((user) => (
                <div key={user.id} className="text-sm">
                  {user.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ConversationList;