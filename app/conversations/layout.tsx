import getUsers from "@/app/actions/getUsers";
import getConversations from "@/app/actions/getConversations";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <div className="h-full">
      <ConversationList
        users={users}
        initialItems={conversations}
      />
      <div className="lg:pl-80 h-full">
        {children}
      </div>
    </div>
  );
}