import getUsers from "@/app/actions/getUsers";
import getConversation from "../actions/getConversation";
import ConversationList from "./components/ConversationList";
import Sidebar from "../components/sidebar/Sidebar";
import getCurrentUser from "../actions/getCurrentUser";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversation();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    <Sidebar currentUser={currentUser!}>
      <div className="h-full">
        <ConversationList
          users={users}
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}