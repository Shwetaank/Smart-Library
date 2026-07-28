import { Search } from "lucide-react";
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
  onBorrow: (id: string) => Promise<any>;
  onReserve: (id: string) => Promise<any>;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => Promise<any>;
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
    <section className="content-grid">
      <div className="main-column">
        <div className="toolbar">
          <label className="search-input">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books"
            />
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="book-grid">
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
            <article className="empty-state">
              <Search size={22} />
              <strong>No books found</strong>
              <span>Try another search term or clear the genre filter.</span>
            </article>
          )}
        </div>
      </div>

      {canManageLibrary && (
        <BookFormPanel
          bookForm={bookForm}
          genres={genresForForm}
          coverUploading={coverUploading}
          onFieldChange={onBookFormFieldChange}
          onUploadCover={onUploadCover}
          onSave={onSaveBook}
          onCancelEdit={onCancelEdit}
        />
      )}
    </section>
  );
}