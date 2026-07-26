import React from "react";
import { BookOpen, Menu, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title, subtitle, loading, onRefresh }) => {
  return (
    <header className="topbar flex items-center justify-between p-4 bg-white shadow-md">
      <div className="topbar-left flex items-center">
        {onMenuClick && (
          <Button className="mobile-menu-toggle mr-2" onClick={onMenuClick} variant="outline" size="icon">
            <Menu size={20} />
          </Button>
        )}
        <BookOpen className="w-8 h-8 text-blue-500" />
        <div className="ml-2">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={loading ? "spin-icon" : ""} size={16} />
          <span className="hidden sm:inline ml-2">Refresh</span>
        </Button>
      )}
    </header>
  );
};

export default Header;
