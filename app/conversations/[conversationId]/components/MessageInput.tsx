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
          text-white
          font-semibold
          py-2.5
          px-4
          bg-transparent
          w-full
          rounded-xl
          focus:outline-none
          placeholder:text-gray-500
          text-base
          tracking-wide
        "
      />
    </div>
  );
}

export default MessageInput;