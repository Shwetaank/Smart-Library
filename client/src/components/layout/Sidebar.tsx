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
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSignOut: () => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
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
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0"`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Library size={28} />
            <div className="ml-2">
              <strong className="block text-lg">SmartLibrary</strong>
              <span className="text-sm text-gray-500">{profile.role}</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          {[
            ["catalog", BookOpen, "Catalog"],
            ["loans", CalendarClock, "Loans"],
            ["reservations", RefreshCw, "Reservations"],
            ["genres", Library, "Genres"],
            ["users", Users, "Users"],
          ].map(([key, NavIcon, label]) => {
            if (key === "users" && !canManageUsers) return null;
            if (key === "genres" && !canManageLibrary) return null;
            return (
              <Button
                variant={activeTab === key ? "secondary" : "ghost"}
                className="w-full justify-start mb-2"
                key={key}
                onClick={() => {
                  onTabChange(key);
                  onClose();
                }}
              >
                <NavIcon size={18} className="mr-2" />
                {label}
              </Button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center mb-4">
            <UserRound size={18} />
            <div className="ml-2">
              <strong>{profile.name || "Library User"}</strong>
              <span className="block text-sm text-gray-500">{profile.email}</span>
            </div>
          </div>
          <Button onClick={onSignOut} variant="outline" className="w-full">
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
