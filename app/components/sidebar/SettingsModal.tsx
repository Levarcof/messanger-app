"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import Input from "../input/input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

import { SafeUser } from "@/app/types";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: SafeUser;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/settings', data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center relative pb-2 group">
            <h2 className="
              text-3xl
              font-extrabold
              text-white
              tracking-tight
              mb-2
            ">
              Settings
            </h2>
            <p className="text-sm text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Personalize your premium experience and manage your global presence.
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full shadow-blue-glow transition-all group-hover:w-20" />
          </div>

          <div className="space-y-10">
            {/* Avatar Section - Centered and High-End */}
            <div className="flex flex-col items-center justify-center pt-2">
              <label
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-blue-500/80
                  mb-6
                "
              >
                Profile Identity
              </label>
              <div className="relative group/avatar">
                <div className="
                  relative 
                  w-32 
                  h-32 
                  rounded-full 
                  overflow-hidden 
                  ring-4 
                  ring-blue-600/20 
                  group-hover/avatar:ring-blue-600/50 
                  transition-all 
                  duration-500
                  shadow-2xl
                ">
                  <Image
                    fill
                    className="object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                    src={image || currentUser?.image || '/placeholder.jpg'}
                    alt="Avatar"
                  />

                  {/* Glass Blur Upload Overlay */}
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="pjlyr7rm"
                  >
                    <div className="
                      absolute 
                      inset-0 
                      bg-black/20 
                      backdrop-blur-[2px] 
                      opacity-0 
                      group-hover/avatar:opacity-100 
                      transition-all 
                      duration-300 
                      flex 
                      flex-col 
                      items-center 
                      justify-center
                      cursor-pointer
                    ">
                      <div className="
                        p-3 
                        bg-white/10 
                        backdrop-blur-md 
                        rounded-full 
                        border 
                        border-white/20 
                        shadow-lg 
                        mb-2
                        transform 
                        translate-y-4 
                        group-hover/avatar:translate-y-0 
                        transition-transform
                      ">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest translate-y-4 group-hover/avatar:translate-y-0 transition-transform">Update</span>
                    </div>
                  </CldUploadButton>
                </div>

                {/* Active Indicator Pulse */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#0f172a] shadow-lg animate-pulse" />
              </div>
              <p className="mt-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                Recommended: 500x500px JPG or PNG
              </p>
            </div>

            {/* Form Fields Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-8 glass-card">
              <div className="flex flex-col gap-y-6">
                <Input
                  disabled={isLoading}
                  label="Display Name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Account Security</label>
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{currentUser?.email}</span>
                      <span className="text-gray-500 text-[11px]">Primary authentication email</span>
                    </div>
                    <div className="px-2 py-1 bg-blue-600/10 rounded-md">
                      <span className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="
            flex 
            items-center 
            justify-center 
            gap-x-4 
            pt-4
          ">
            <Button
              disabled={isLoading}
              secondary
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
            >
              Verify & Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default SettingsModal;