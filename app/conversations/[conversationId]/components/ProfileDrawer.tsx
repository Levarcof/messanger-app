"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import Avatar from "@/app/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import clsx from "clsx";
import Image from "next/image";
import { FullConversationType } from "@/app/types";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullConversationType
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser?.createdAt || new Date()), 'PP');
  }, [otherUser?.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser?.name || 'Chat';
  }, [data.name, otherUser?.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="
                fixed
                inset-0
                bg-black
                bg-opacity-40
              "
            />
          </Transition.Child>

          <div
            className="
              fixed
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                inset-0
                overflow-hidden
              "
            >
              <div className="
                pointer-events-none
                fixed
                inset-y-0
                right-0
                flex
                max-w-full
                pl-10
              ">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className="
                      pointer-events-auto
                      w-screen
                      max-w-md
                    "
                  >
                    <div
                      className="
                        flex
                        h-full
                        flex-col
                        overflow-y-scroll
                        bg-[#0f172a]
                        py-6
                        shadow-xl
                        border-l border-white/5
                      "
                    >
                      <div className="px-4 sm:px-6">
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            items-center
                            mt-2
                          "
                        >
                          <h3 className="text-xl font-bold text-white tracking-tight">Identity Hub</h3>
                          <div className="flex h-7 items-center">
                            <button
                              onClick={onClose}
                              type="button"
                              className="
                                rounded-xl
                                bg-white/5
                                text-gray-400
                                hover:text-blue-500
                                hover:bg-blue-600/10
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-600
                                transition-all
                                duration-300
                                p-1.5
                              "
                            >
                              <span className="sr-only">Close hub</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-12 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          {/* Cinematic Avatar Section */}
                          <div className="relative group/avatar mb-6">
                            <div className="
                              relative 
                              w-40 
                              h-40 
                              rounded-full 
                              overflow-hidden 
                              ring-4 
                              ring-blue-600/20 
                              group-hover/avatar:ring-blue-600/50 
                              transition-all 
                              duration-500
                              shadow-2xl
                            ">
                              {data.isGroup ? (
                                <AvatarGroup users={data.users} />
                              ) : (
                                <Image
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                  src={otherUser?.image || '/images/placeholder.jpg'}
                                  alt="Avatar"
                                />
                              )}
                            </div>

                            {!data.isGroup && isActive && (
                              <div className="absolute bottom-4 right-4 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0f172a] shadow-lg animate-pulse" />
                            )}
                          </div>

                          <div className="text-center">
                            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                              {title}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                              <span className={clsx(`
                                px-2.5 
                                py-0.5 
                                rounded-md 
                                text-[10px] 
                                font-bold 
                                uppercase 
                                tracking-widest
                              `,
                                isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"
                              )}>
                                {statusText}
                              </span>
                            </div>
                          </div>

                          {/* Professional Information Blocks */}
                          <div className="w-full mt-10 space-y-4">
                            <div className="glass-card p-5 border border-white/5 rounded-3xl bg-white/[0.02]">
                              <dl className="space-y-6">
                                {data.isGroup ? (
                                  <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/70 mb-2">
                                      Circle Members
                                    </dt>
                                    <dd className="text-sm text-white/90 font-medium leading-relaxed">
                                      {data.users.map((user) => user.name).join(', ')}
                                    </dd>
                                  </div>
                                ) : (
                                  <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/70 mb-2">
                                      Communication
                                    </dt>
                                    <dd className="text-sm text-white/90 font-medium truncate">
                                      {otherUser.email}
                                    </dd>
                                  </div>
                                )}

                                <hr className="border-white/5" />

                                <div>
                                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/70 mb-2">
                                    Established Since
                                  </dt>
                                  <dd className="text-sm text-white/90 font-medium">
                                    <time dateTime={joinedDate}>
                                      {joinedDate}
                                    </time>
                                  </dd>
                                </div>
                              </dl>
                            </div>

                            {/* Danger Area */}
                            <div className="p-5 border border-rose-500/10 rounded-3xl bg-rose-500/[0.02]">
                              <div
                                onClick={() => setConfirmOpen(true)}
                                className="flex items-center justify-between cursor-pointer group/delete"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-rose-500">Purge Conversation</span>
                                  <span className="text-[10px] text-rose-500/60 uppercase tracking-wider">This action is irreversible</span>
                                </div>
                                <div className="p-3 bg-rose-500/10 rounded-2xl group-hover/delete:bg-rose-500/20 transition-all shadow-sm">
                                  <IoTrash size={20} className="text-rose-500" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default ProfileDrawer;