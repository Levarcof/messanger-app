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
        <div
            className="
                py-4
                px-4
                lg:px-6
                bg-transparent
                absolute
                bottom-0
                w-full
                z-10
            "
        >
            <div className="
                w-full
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
                focus-within:shadow-premium
                focus-within:border-wine-500/50
            ">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="pjlyr7rm"
                >
                    <div className="p-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-500 hover:text-wine-500">
                        <HiPhoto size={26} />
                    </div>
                </CldUploadButton>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full">
                    <div className="flex-1">
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            required
                            placeholder="Share your thoughts elegantly..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="
                            rounded-xl 
                            p-3 
                            bg-wine-600
                            cursor-pointer 
                            hover:shadow-wine
                            hover:scale-105 
                            active:scale-95 
                            transition-all
                            duration-300
                            wine-glow
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