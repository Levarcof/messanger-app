import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import { SafeUser } from "@/app/types";

interface SidebarProps {
  children: React.ReactNode;
  currentUser: SafeUser;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  currentUser,
}) => {
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser} />
      <MobileFooter currentUser={currentUser} />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;