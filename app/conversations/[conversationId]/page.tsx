import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

// Next.js 13/14+ me Server Components ke params Promise hote hain, isliye hum unhe await karte hain
const ConversationId = async ({ params }: { params: Promise<IParams> | any }) => {
  // Safe resolution for Next.js dynamic route parameters
  const resolvedParams = await params;
  const conversation = await getConversationById(resolvedParams.conversationId);
  const messages = await getMessages(resolvedParams.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full w-full overflow-x-hidden">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    /* 
      Fixes applied here:
      1. w-full aur max-w-full lock karta hai layout ko screen ke andar.
      2. overflow-x-hidden left/right ke faltu scroll ko bilkul band kar deta hai.
    */
    <div className="lg:pl-80 h-full w-full max-w-full overflow-x-hidden position-relative">
      {/* min-w-0 flex-1 guarantees children won't break the layout width boundaries */}
      <div className="h-full w-full flex flex-col min-w-0 overflow-hidden">
        <Header conversation={conversation as any} />
        <Body initialMessages={messages as any} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
