"use client";

import { useEffect, useRef, useState } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

import useMessagesStore from "@/app/hooks/useMessagesStore";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
  initialMessages
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    prependMessages,
    hasMore,
    setHasMore
  } = useMessagesStore();

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    const reversed = [...initialMessages].reverse();
    setMessages(reversed);
    setHasMore(initialMessages.length === 20);
  }, [initialMessages, setMessages, setHasMore]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  const loadMoreMessages = async () => {
    if (isLoading || !hasMore || messages.length === 0) return;

    setIsLoading(true);
    const lastMessageId = messages[0].id;

    try {
      const response = await axios.get(`/api/conversations/${conversationId}/messages?cursor=${lastMessageId}&limit=20`);
      const newMessages = response.data;

      if (newMessages.length < 20) {
        setHasMore(false);
      }

      if (newMessages.length > 0) {
        prependMessages([...newMessages].reverse());
      }
    } catch (error) {
      console.error("Failed to load more messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      addMessage(message);
      virtuosoRef.current?.scrollToIndex({
        index: 'LAST',
        behavior: 'smooth'
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      updateMessage(newMessage);
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    }
  }, [conversationId, addMessage, updateMessage]);

  return (
    <div className="flex-1 h-full overflow-hidden bg-[#070b14]">
      <div className="h-full w-full bg-[#0b1120]/40">
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          initialTopMostItemIndex={messages.length - 1}
          followOutput="smooth"
          startReached={loadMoreMessages}
          components={{
            Header: () => (
              <div className="h-4">
                {isLoading && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 shadow-blue-glow" />
                  </div>
                )}
              </div>
            ),
            Footer: () => <div className="h-32" />
          }}
          itemContent={(index, message) => (
            <MessageBox
              isLast={index === messages.length - 1}
              key={message.id}
              data={message}
            />
          )}
        />
      </div>
    </div>
  );
}

export default Body;
