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

const navItems = [
  ["catalog", BookOpen, "Catalog"],
  ["loans", CalendarClock, "Loans"],
  ["reservations", RefreshCw, "Reservations"],
  ["genres", Library, "Genres"],
  ["users", Users, "Users"],
] as const;

const Sidebar = ({
  isOpen,
  onClose,
  profile,
  onSignOut,
  activeTab,
  onTabChange,
  canManageUsers,
  canManageLibrary,
}: SidebarProps) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Library size={28} />

          <div>
            <strong>SmartLibrary</strong>
            <span>{profile?.role}</span>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle ml-auto"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav>
          {navItems.map(([key, Icon, label]) => {
            if (key === "users" && !canManageUsers) return null;
            if (key === "genres" && !canManageLibrary) return null;

            return (
              <button
                key={key}
                type="button"
                className={activeTab === key ? "active" : ""}
                aria-current={activeTab === key ? "page" : undefined}
                onClick={() => {
                  onTabChange(key);
                  onClose();
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="profile-box">
          <UserRound size={18} />

          <div>
            <strong>{profile?.name || "Library User"}</strong>
            <span>{profile?.email}</span>
          </div>
        </div>

        {/* Sign out */}
        <Button
          type="button"
          variant="secondary"
          onClick={onSignOut}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </Button>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="main-overlay is-visible"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default React.memo(Sidebar);