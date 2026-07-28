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

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  title,
  subtitle,
  loading,
  onRefresh,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {onMenuClick && (
          <Button
            className="mobile-menu-toggle"
            onClick={onMenuClick}
            variant="outline"
            size="icon"
          >
            <Menu size={20} />
          </Button>
        )}
        <BookOpen size={22} style={{ color: "var(--primary)" }} />
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={loading ? "spin-icon" : ""} size={16} />
          <span>Refresh</span>
        </Button>
      )}
    </header>
  );
};

export default Header;

