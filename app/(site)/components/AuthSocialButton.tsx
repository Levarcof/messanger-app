import { IconType } from "react-icons";

interface AuthSocialButtonProps {
    icon: IconType,
    onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ icon: Icon, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                inline-flex 
                w-full 
                justify-center 
                rounded-xl 
                bg-white/5 
                py-2.5 
                px-4 
                text-neutral-300 
                shadow-soft 
                ring-1 
                ring-white/10 
                hover:bg-wine-500/10 
                hover:ring-wine-500/20
                focus:outline-offset-0
                transition-all
                duration-300
            "
        >
            <Icon className="h-5 w-5" />
        </button>
    );
}

export default AuthSocialButton;
