import React from "react";
import {
  BookMarked,
  BookOpen,
  CalendarClock,
  Library,
  LogOut,
  RefreshCw,
  Users,
  X,
} from "lucide-react";

import type { Tab, User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: User | null;
  onSignOut: () => void;
  activeTab: Tab;
  onTabChange: (newTab: Tab) => void;
  canManageUsers: boolean;
  canManageLibrary: boolean;
}

const navItems = [
  ["catalog", BookOpen, "Catalog"],
  ["loans", CalendarClock, "Loans"],
  ["reservations", RefreshCw, "Reservations"],
  ["genres", BookMarked, "Genres"],
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
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
          <Library size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-white">SmartLibrary</h2>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <Separator className="bg-slate-800" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map(([key, Icon, label]) => {
            if (key === "users" && !canManageUsers) return null;
            if (key === "genres" && !canManageLibrary) return null;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onTabChange(key);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  activeTab === key
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
                {activeTab === key && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-slate-800" />

      {/* Profile Section */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
          <Avatar className="h-9 w-9 border border-slate-700">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs text-emerald-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {profile?.name || "Library User"}
            </p>
            <p className="truncate text-xs text-slate-400">{profile?.email}</p>
          </div>
          <Badge
            variant="outline"
            className="border-slate-700 text-[10px] uppercase text-slate-400"
          >
            {profile?.role?.slice(0, 4) || "USER"}
          </Badge>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-slate-400 hover:bg-slate-800/50 hover:text-white"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="border-r border-slate-800 bg-slate-950 flex flex-1 flex-col">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sheet Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 animate-in slide-in-from-left">
            <div className="border-r border-slate-800 bg-slate-950 shadow-2xl flex h-full flex-col">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Sidebar);