"use client";
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
interface InputProps {
    label: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors,
    disabled?: boolean;

}


const Input: React.FC<InputProps> = ({ label, id, type, required, register, errors, disabled }) => {
    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-neutral-200" htmlFor={id} >
                {label}
            </label>

            <div className="mt-2">
                <input type={type} autoComplete={id} disabled={disabled} {...register(id, { required })}
                    className={clsx(`
              form-input 
              block 
              w-[100%]
              rounded-xl 
              border-0 
              px-4 
              py-2.5 
              bg-white/5
              text-neutral-100 
              shadow-premium 
              ring-1 
              ring-inset 
              ring-white/10 
              placeholder:text-neutral-600 
              focus:ring-2 
              focus:inset 
              focus:ring-wine-600 
              sm:text-sm 
              sm:leading-6 
              transition-all
              duration-300
            `
                        , errors[id] && "focus:ring-rose-500", disabled && "opacity-50 cursor-default"
                    )} />

            </div>
        </div>
    );
}

export default Input;