
"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import React, { memo, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const ImageModal = dynamic(() => import("./ImageModal"), {
    ssr: false
});

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = memo(({
    data,
    isLast
}) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = useMemo(() => {
        return session?.data?.user?.email === data?.sender?.email;
    }, [session?.data?.user?.email, data?.sender?.email]);

    const seenList = useMemo(() => {
        return (data.seen || [])
            .filter((user) => user.email !== data?.sender?.email)
            .map((user) => user.name)
            .join(', ');
    }, [data.seen, data.sender?.email]);

    const container = useMemo(() => clsx(
        "flex gap-3 px-4 py-3",
        isOwn && "justify-end"
    ), [isOwn]);

    const avatar = useMemo(() => clsx(isOwn && "order-2"), [isOwn]);

    const body = useMemo(() => clsx(
        "flex flex-col gap-1.5",
        isOwn && "items-end"
    ), [isOwn]);

    const message = useMemo(() => clsx(
        "text-sm w-fit overflow-hidden transition-all duration-300",
        isOwn
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg rounded-2xl rounded-tr-none'
            : 'bg-slate-800 border border-white/5 shadow-soft text-gray-200 rounded-2xl rounded-tl-none',
        data.image ? 'p-0 overflow-hidden' : 'py-3 px-4'
    ), [isOwn, data.image]);

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-[13px] font-bold text-white">
                        {data.sender?.name}
                    </div>
                    <div className="text-[10px] font-medium text-gray-500">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="Image"
                            height="288"
                            width="288"
                            src={data.image}
                            className="
                                object-cover
                                cursor-pointer
                                hover:scale-105
                                transition-all
                                duration-500
                            "
                        />
                    ) : (
                        <div className="leading-relaxed font-medium">{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && (
                    <div className="text-[10px] font-medium text-gray-500/80 mt-1 self-end pr-1">
                        {seenList.length > 0 ? 'Seen' : 'Sent'}
                    </div>
                )}
            </div>
        </div>
    );
});

export default MessageBox;