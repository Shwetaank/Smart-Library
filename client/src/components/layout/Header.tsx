import React from "react";
import { BookOpen, Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

const Header = ({
  onMenuClick,
  title,
  subtitle,
  loading = false,
  onRefresh,
}: HeaderProps) => {
  return (
    // Application header
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu button */}
        {onMenuClick && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mobile-menu-toggle"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>
        )}

        {/* Application logo */}
        <BookOpen size={22} className="text-primary" />

        {/* Page title */}
        <div className="flex flex-col">
          <h1 className="truncate text-xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Refresh button */}
      {onRefresh && (
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh page"
          title="Refresh data"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </Button>
      )}
    </header>
  );
};

export default React.memo(Header);