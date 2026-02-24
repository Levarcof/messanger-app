import { create } from "zustand";
import { FullMessageType } from "../types";
import { find } from "lodash";

interface MessagesStore {
    messages: FullMessageType[];
    hasMore: boolean;
    setHasMore: (hasMore: boolean) => void;
    setMessages: (messages: FullMessageType[]) => void;
    addMessage: (message: FullMessageType) => void;
    prependMessages: (messages: FullMessageType[]) => void;
    updateMessage: (message: FullMessageType) => void;
};

const useMessagesStore = create<MessagesStore>((set) => ({
    messages: [],
    hasMore: true,
    setHasMore: (hasMore) => set({ hasMore }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => {
        if (find(state.messages, { id: message.id })) {
            return state;
        }

        // Optimistic reconciliation: find a temp message from same sender with same content
        const optimisticMatch = state.messages.find((m) =>
            m.id.toString().startsWith('temp-') &&
            m.sender.email === message.sender.email &&
            ((message.body && m.body === message.body) || (message.image && m.image === message.image))
        );

        if (optimisticMatch) {
            return {
                messages: state.messages.map((m) =>
                    m.id === optimisticMatch.id ? message : m
                )
            };
        }

        return { messages: [...state.messages, message] };
    }),
    prependMessages: (newMessages) => set((state) => ({
        messages: [...newMessages, ...state.messages]
    })),
    updateMessage: (newMessage) => set((state) => ({
        messages: state.messages.map((current) =>
            current.id === newMessage.id ? newMessage : current
        )
    })),
}));

export default useMessagesStore;
