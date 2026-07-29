import React from "react";
import { BookOpen, Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

const Header = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    getHeaderTitle,
    books,
    genres,
    loading,
    loadCore,
  } = useAppContext();

  const onMenuClick = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const title = getHeaderTitle();
  const subtitle = books.selectedBook
    ? books.selectedBook.id
    : `${books.books.total} books indexed across ${genres.genres.length} genres.`;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
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
        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
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

      {/* Refresh button */}
      {loadCore && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadCore}
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
    </header>
  );
};

export default React.memo(Header);

