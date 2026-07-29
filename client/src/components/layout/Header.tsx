import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Menu, Moon, RefreshCw, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
  loading: boolean;
  onRefresh: () => void;
}

const Header = ({
  onMenuClick,
  title,
  subtitle,
  loading,
  onRefresh,
}: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const next =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light";

    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const Icon = useMemo(() => {
    return theme === "dark" ? Sun : Moon;
  }, [theme]);

  const onToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu button */}
        {onMenuClick && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>
        )}

        {/* Icon */}
        <div className="from-emerald-500/10 to-cyan-500/10 hidden h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br sm:flex">
          <BookOpen size={18} className="text-emerald-500" />
        </div>

        {/* Title & subtitle */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="shrink-0"
        >
          <Icon size={18} className="text-foreground" />
        </Button>

        {/* Refresh button */}
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="shrink-0"
          >
            <RefreshCw
              size={14}
              className={cn("transition-transform", loading && "animate-spin")}
            />
            <span className="hidden sm:inline">
              {loading ? "Refreshing..." : "Refresh"}
            </span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);