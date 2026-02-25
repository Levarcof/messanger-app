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
                secondary ? "bg-white/5 text-neutral-300 hover:bg-wine-500/10 border border-white/5" : "text-white",
                danger && "bg-rose-600/20 text-rose-500 hover:bg-rose-600/30 border border-rose-500/20 shadow-soft",
                !secondary && !danger && "bg-gradient-to-r from-wine-600 to-wine-700 hover:shadow-wine wine-glow focus-visible:outline-wine-600"
            )}
        >
            {children}
        </button>
    );
}

export default Button;