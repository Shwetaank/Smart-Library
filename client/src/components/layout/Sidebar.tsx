import React from "react";
import {
  BookOpen,
  CalendarClock,
  Library,
  LogOut,
  RefreshCw,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: { name?: string | null; email: string; role: string } | null;
  onSignOut: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  canManageUsers: boolean;
  canManageLibrary: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  profile,
  onSignOut,
  activeTab,
  onTabChange,
  canManageUsers,
  canManageLibrary,
}) => {
  const navItems = [
    ["catalog", BookOpen, "Catalog"],
    ["loans", CalendarClock, "Loans"],
    ["reservations", RefreshCw, "Reservations"],
    ["genres", Library, "Genres"],
    ["users", Users, "Users"],
  ] as const;

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "is-open" : ""}`}
      >
        <div className="sidebar-brand">
          <Library size={28} />
          <div>
            <strong>SmartLibrary</strong>
            <span>{profile?.role}</span>
          </div>
          <button onClick={onClose} className="mobile-menu-toggle" type="button" style={{ marginLeft: "auto" }}>
            <X size={20} />
          </button>
        </div>
        <nav>
          {navItems.map(([key, NavIcon, label]) => {
            if (key === "users" && !canManageUsers) return null;
            if (key === "genres" && !canManageLibrary) return null;
            return (
              <button
                className={activeTab === key ? "active" : ""}
                key={key}
                onClick={() => {
                  onTabChange(key);
                  onClose();
                }}
                type="button"
              >
                <NavIcon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="profile-box">
          <UserRound size={18} />
          <div>
            <strong>{profile?.name || "Library User"}</strong>
            <span>{profile?.email}</span>
          </div>
        </div>
        <Button onClick={onSignOut} variant="secondary">
          <LogOut size={16} />
          Sign out
        </Button>
      </aside>
      {isOpen && (
        <div className="main-overlay is-visible" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;

