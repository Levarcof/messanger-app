"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/input/input";
import Select from "@/app/components/input/Select";
import { SafeUser } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: SafeUser[]
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          {/* Cinematic Header Section */}
          <div className="text-center relative pb-2 group pb-8">
            <h2 className="
              text-3xl
              font-extrabold
              text-white
              tracking-tight
              mb-2
            ">
              Create Group
            </h2>
            <p className="text-sm text-gray-400 max-w-[300px] mx-auto leading-relaxed">
              Start a premium collaborative experience with your selected circle.
            </p>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full shadow-blue-glow transition-all group-hover:w-20" />
          </div>

          <div className="space-y-10">
            <div
              className="
                bg-white/[0.02] 
                border 
                border-white/5 
                rounded-3xl 
                p-6 
                space-y-8 
                glass-card
              "
            >
              <div className="flex flex-col gap-y-8">
                <Input
                  register={register}
                  label="Group Identity"
                  id="name"
                  disabled={isLoading}
                  required
                  errors={errors}
                  placeholder="The elite squad..."
                />

                <div className="space-y-2">
                  <Select
                    disabled={isLoading}
                    label="Assemble Members"
                    options={users.map((user) => ({
                      value: user.id,
                      label: user.name
                    }))}
                    onChange={(value) => setValue('members', value, {
                      shouldValidate: true
                    })}
                    value={members}
                  />
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest px-1">
                    Select 2 or more members to initiate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-x-4
          "
        >
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Disregard
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
          >
            Initiate Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default GroupChatModal;