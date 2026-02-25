"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="
          text-neutral-100
          font-medium
          py-2.5
          px-4
          bg-transparent
          w-full
          rounded-xl
          focus:outline-none
          placeholder:text-neutral-600
          text-base
        "
      />
    </div>
  );
}

export default MessageInput;