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
        <div className="space-y-10">
          <div className="pb-4">
            <h2 className="
              text-xl
              font-bold
              text-white
              tracking-tight
            ">
              Profile Settings
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Manage your personal information and presence.
            </p>

            <div className="
              mt-8
              flex
              flex-col
              gap-y-6
            ">
              <Input
                disabled={isLoading}
                label="Display Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-neutral-200
                    mb-2
                  "
                >
                  Profile Photo
                </label>
                <div className="
                  flex
                  items-center
                  gap-x-4
                ">
                  <div className="relative group cursor-pointer" onClick={() => { }}>
                    <Image
                      width="64"
                      height="64"
                      className="rounded-2xl shadow-premium group-hover:shadow-wine transition-all duration-300"
                      src={image || currentUser?.image || '/placeholder.jpg'}
                      alt="Avatar"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-[10px] font-bold uppercase tracking-widest">Update</div>
                    </div>
                  </div>
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="pjlyr7rm"
                  >
                    <div className="
                      px-4 
                      py-2 
                      rounded-xl 
                      border 
                      border-white/5
                      bg-white/5
                      text-sm 
                      font-semibold 
                      text-neutral-300 
                      hover:bg-wine-500/10 
                      hover:border-wine-500/20
                      transition-all
                    ">
                      Change Photo
                    </div>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              justify-end
              gap-x-3
            "
          >
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
              Save Changes
            </Button>
          </div>

        </div>
      </form>
    </Modal>
  );
}

export default SettingsModal;