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
          text-neutral-500
          hover:text-wine-500
          hover:bg-wine-500/5
        `,
          active ? 'bg-wine-500/10 text-wine-500 shadow-soft' : 'bg-transparent'
        )}
      >
        <Icon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-110" />
        <span className="sr-only">{label}</span>
        {active && (
          <div className="absolute left-[-1.5rem] w-1 h-8 bg-wine-500 rounded-r-full shadow-[0_0_10px_rgba(128,0,32,0.6)] animate-in fade-in slide-in-from-left-2 duration-300" />
        )}
      </Link>
    </li>
  );
}

export default DesktopItem;