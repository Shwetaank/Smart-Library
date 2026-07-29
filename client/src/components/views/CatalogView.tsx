import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/ui/BookCard";
import { BookFormPanel } from "@/components/ui/BookForm";
import type { Book, BookForm, Genre, PageResult } from "@/types";

interface CatalogViewProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: Genre[];
  books: PageResult<Book>;
  onOpenBook: (id: string) => Promise<Book>;
  onBorrow: (id: string) => Promise<unknown>;
  onReserve: (id: string) => Promise<unknown>;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => Promise<unknown>;
  canManageLibrary: boolean;
  bookForm: BookForm;
  genresForForm: Genre[];
  coverUploading: boolean;
  onBookFormFieldChange: (field: Partial<BookForm>) => void;
  onUploadCover: (file?: File) => Promise<void>;
  onSaveBook: () => Promise<void>;
  onCancelEdit: () => void;
}

export function CatalogView({
  search,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  books,
  onOpenBook,
  onBorrow,
  onReserve,
  onEditBook,
  onDeleteBook,
  canManageLibrary,
  bookForm,
  genresForForm,
  coverUploading,
  onBookFormFieldChange,
  onUploadCover,
  onSaveBook,
  onCancelEdit,
}: CatalogViewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {/* Toolbar */}
        <div className="space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search books..."
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-44"
            >
              <option value="">All genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedGenre) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {search && <Badge variant="secondary">Search: {search}</Badge>}
              {selectedGenre && (
                <Badge variant="secondary">
                  Genre: {genres.find((g) => g.id === selectedGenre)?.name ?? "Selected"}
                </Badge>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  onSearchChange("");
                  onGenreChange("");
                }}
              >
                <X size={12} />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {books.items.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpen={onOpenBook}
              onBorrow={onBorrow}
              onReserve={onReserve}
              onEdit={onEditBook}
              onDelete={onDeleteBook}
              canManageLibrary={canManageLibrary}
            />
          ))}

          {!books.items.length && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
              <Search size={32} className="mb-3 text-muted-foreground/50" />
              <h3 className="mb-1 text-base font-semibold text-foreground">No books found</h3>
              <p className="text-sm text-muted-foreground">
                Try another search term or clear the genre filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel - Book Form */}
      {canManageLibrary && (
        <div className="order-first lg:order-last">
          <BookFormPanel
            bookForm={bookForm}
            genres={genresForForm}
            coverUploading={coverUploading}
            onFieldChange={onBookFormFieldChange}
            onUploadCover={onUploadCover}
            onSave={onSaveBook}
            onCancelEdit={onCancelEdit}
          />
        </div>
      )}
    </div>
  );
}

