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
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
        >
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}
                uploadPreset="pjlyr7rm"
            >
                <HiPhoto size={30} className="text-sky-500" />
            </CldUploadButton>
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full">
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button
                    type="submit"
                    className=" rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition">
                    <HiPaperAirplane
                        size={18}
                        className="text-white"
                    />
                </button>
            </form>
        </div>
    );
}

export default Form;