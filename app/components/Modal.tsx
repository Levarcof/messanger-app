"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  return (
    <Transition.Root
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed
              inset-0
              bg-black/60
              backdrop-blur-md
              transition-opacity
            "
          />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="
              flex
              min-h-full
              items-center
              justify-center
              p-4
              text-center
              sm:p-0
            "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="
                  relative
                  transform
                  overflow-hidden
                  rounded-2xl
                  bg-[#141414]
                  px-4
                  pb-4
                  text-left
                  shadow-premium
                  transition-all
                  w-full
                  sm:my-8
                  sm:w-full
                  sm:max-w-lg
                  sm:p-8
                  ring-1
                  ring-white/5
                "
              >
                <div
                  className="
                    absolute
                    right-0
                    top-0
                    hidden
                    pr-6
                    pt-6
                    sm:block
                    z-10
                  "
                >
                  <button
                    type="button"
                    className="
                      rounded-xl
                      bg-white/5
                      p-2
                      text-neutral-500
                      hover:text-wine-500
                      hover:bg-wine-500/10
                      focus:outline-none
                      focus:ring-2
                      focus:ring-wine-600
                      focus:ring-offset-2
                      focus:ring-offset-[#141414]
                      transition-all
                      duration-300
                    "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose
                      className="
                        h-6
                        w-6
                      "
                    />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;