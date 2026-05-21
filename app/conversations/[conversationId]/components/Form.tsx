"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";

import MessageInput from "./MessageInput";

import { useSession } from "next-auth/react";
import useMessagesStore from "@/app/hooks/useMessagesStore";

const Form = () => {
    const { conversationId } = useConversation();
    const { data: session } = useSession();
    const { addMessage } = useMessagesStore();

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });

        // Optimistic Update
        if (session?.user?.email) {
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                body: data.message,
                image: null,
                createdAt: new Date(),
                seen: [],
                sender: {
                    id: 'temp-id',
                    name: session.user.name || 'You',
                    email: session.user.email,
                    image: session.user.image || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    emailVerified: null,
                    hashedPassword: null,
                    conversationIds: [],
                    seenMessageIds: []
                },
                senderId: 'temp-id',
                conversationId: conversationId
            };
            addMessage(optimisticMessage as any);
        }

        axios.post('/api/messages', {
            ...data,
            conversationId
        })
    };

    const handleUpload = (result: any) => {
        // Optimistic Update for images
        if (session?.user?.email && result?.info?.secure_url) {
            const optimisticImage = {
                id: `temp-img-${Date.now()}`,
                body: null,
                image: result.info.secure_url,
                createdAt: new Date(),
                seen: [],
                sender: {
                    id: 'temp-id',
                    name: session.user.name || 'You',
                    email: session.user.email,
                    image: session.user.image || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    emailVerified: null,
                    hashedPassword: null,
                    conversationIds: [],
                    seenMessageIds: []
                },
                senderId: 'temp-id',
                conversationId: conversationId
            };
            addMessage(optimisticImage as any);
        }

        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    }

    return (
        /* 
          FIX 1: Removed absolute layout completely. 
          Using strict width bounds and 'flex-shrink-0' so it anchors natively 
          at the bottom of the flex column without overflowing.
        */
        <div
            className="
                py-4
                px-4
                lg:px-6
                bg-transparent
                w-full
                max-w-full
                flex-shrink-0
                min-w-0
            "
        >
            <div className="
                w-full
                min-w-0
                glass-card 
                rounded-2xl 
                flex 
                items-center 
                gap-2 
                lg:gap-4 
                px-4 
                py-3
                transition-all
                duration-300
                focus-within:border-blue-500/50
                focus-within:shadow-blue-glow
            ">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="pjlyr7rm"
                >
                    <div className="p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer text-gray-500 hover:text-blue-500 flex-shrink-0">
                        <HiPhoto size={26} />
                    </div>
                </CldUploadButton>
                
                {/* FIX 2: Enforced min-w-0 configuration to dynamic forms */}
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full min-w-0 flex-1"
                >
                    {/* FIX 3: Locked down child container min-width rule */}
                    <div className="flex-1 min-w-0">
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            required
                            placeholder="Type a premium message..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="
                            rounded-xl 
                            p-3 
                            bg-blue-600
                            cursor-pointer 
                            hover:shadow-blue-glow
                            hover:scale-105 
                            active:scale-95 
                            transition-all
                            duration-300
                            hover:bg-blue-500
                            flex-shrink-0
                        "
                    >
                        <HiPaperAirplane
                            size={20}
                            className="text-white transform rotate-45 -translate-y-0.5 translate-x-0.5"
                        />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Form;
