"use client"

import clsx from "clsx";

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}


const Button: React.FC<ButtonProps> = ({ type, fullWidth, children, onClick, secondary, danger, disabled }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(`
        flex 
        justify-center 
        rounded-xl 
        px-4 
        py-2.5 
        text-sm 
        font-semibold 
        transition-all 
        duration-300
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2
      `,
                fullWidth && "w-full",
                secondary ? "bg-white/5 text-gray-300 hover:bg-blue-600/10 border border-white/5" : "text-white",
                danger && "bg-rose-600/20 text-rose-500 hover:bg-rose-600/30 border border-rose-500/20 shadow-soft",
                !secondary && !danger && "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-glow focus-visible:outline-blue-600"
            )}
        >
            {children}
        </button>
    );
}

export default Button;