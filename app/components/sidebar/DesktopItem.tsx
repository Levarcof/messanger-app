'use client';

import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(`
          group 
          relative
          flex 
          items-center 
          justify-center
          rounded-2xl
          p-3.5 
          transition-all
          duration-300
          text-gray-400
          hover:text-white
          hover:bg-blue-600/10
        `,
          active ? 'bg-blue-600/20 text-white shadow-blue-glow' : 'bg-transparent'
        )}
      >
        <Icon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-110" />
        <span className="sr-only">{label}</span>
        {active && (
          <div className="absolute left-[-1.5rem] w-1.5 h-8 bg-blue-600 rounded-r-xl shadow-blue-glow animate-in fade-in slide-in-from-left-2 duration-300" />
        )}
      </Link>
    </li>
  );
}

export default DesktopItem;