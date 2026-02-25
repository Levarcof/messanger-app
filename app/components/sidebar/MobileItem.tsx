"use client";

import Link from "next/link";
import clsx from "clsx";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  }

  return (
    <Link
      onClick={onClick}
      href={href}
      className={clsx(`
        group
        flex
        items-center
        justify-center
        w-full
        p-4
        text-neutral-500
        transition-all
        duration-300
        hover:text-wine-500
        relative
      `,
        active && "text-wine-500"
      )}
    >
      <Icon className={clsx("h-6 w-6 transition-transform group-active:scale-90", active && "scale-110")} />
      {active && (
        <div className="absolute bottom-1 w-1.5 h-1.5 bg-wine-500 rounded-full shadow-[0_0_8px_rgba(128,0,32,0.8)]" />
      )}
    </Link>
  );
}

export default MobileItem;