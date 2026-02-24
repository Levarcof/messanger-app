"use client";

import { useEffect, useRef, useState } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

import useMessagesStore from "@/app/hooks/useMessagesStore";

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

  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    // initialMessages logic: reverse them because DB returns desc
    const reversed = [...initialMessages].reverse();
    setMessages(reversed);
    setHasMore(initialMessages.length === 20); // Assuming 20 is the limit
  }, [initialMessages, setMessages, setHasMore]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMessages();
        }
      },
      { threshold: 1.0 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, messages]);

  const loadMoreMessages = async () => {
    if (isLoading || !hasMore || messages.length === 0) return;

    setIsLoading(true);
    const lastMessageId = messages[0].id; // Messages are sorted asc in state, so messages[0] is the oldest

    try {
      const response = await axios.get(`/api/conversations/${conversationId}/messages?cursor=${lastMessageId}&limit=20`);
      const newMessages = response.data;

      if (newMessages.length < 20) {
        setHasMore(false);
      }

      if (newMessages.length > 0) {
        // newMessages are desc from API, reverse them to prepend
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
    // bottomRef?.current?.scrollIntoView(); // Only scroll on initial load or new message

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      addMessage(message);
      bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
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
  }, [conversationId]);
  return (
    <div className="flex-1 overflow-y-auto">
      <div ref={topRef} className="h-1" />
      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500" />
        </div>
      )}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
}

export default Body;