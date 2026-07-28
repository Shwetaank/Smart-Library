import React from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/api";
import type { Book, BookForm, Genre, Loan, Reservation } from "@/types";

type BookDetailProps = {
  book: Book;
  bookForm: BookForm;
  genres: Genre[];
  selectedBookLoan?: Loan;
  selectedBookReservation?: Reservation;
  selectedBookLoading: boolean;
  coverUploading: boolean;
  canManageLibrary: boolean;
  onClose: () => void;
  onBorrow: (id: string) => void;
  onReserve: (id: string) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onFormFieldChange: (field: Partial<BookForm>) => void;
  onUploadCover: (file?: File) => void;
  onSaveBook: () => void;
  onCancelEdit: () => void;
};

const BookDetail = ({
  book,
  bookForm,
  genres,
  selectedBookLoan,
  selectedBookReservation,
  selectedBookLoading,
  coverUploading,
  canManageLibrary,
  onClose,
  onBorrow,
  onReserve,
  onEdit,
  onDelete,
  onFormFieldChange,
  onUploadCover,
  onSaveBook,
  onCancelEdit,
}: BookDetailProps) => {
  const availabilityPercent = Math.max(
    0,
    Math.min(100, (book.availableCopies / book.quantity) * 100),
  );

  return (
    // Book details view
    <section className="book-detail-grid">
      <article className="book-detail-main">
        {/* Back navigation */}
        <button className="back-link" onClick={onClose} type="button">
          <ArrowLeft size={16} />
          Back to catalog
        </button>

        {/* Book information */}
        <div className="book-detail-hero">
          <div className="book-detail-cover">
            {book.coverUrl ? (
              <img alt={`${book.title} cover`} src={book.coverUrl} />
            ) : (
              book.title.slice(0, 1)
            )}
          </div>

          <div className="book-detail-copy">
            <span className="book-kicker">
              {book.genre?.name ?? "Uncategorized"}
            </span>

            <h2>{book.title}</h2>

            <p>by {book.author}</p>

            <div className="detail-actions">
              <Button
                onClick={() => onBorrow(book.id)}
                disabled={
                  book.availableCopies <= 0 || Boolean(selectedBookLoan)
                }
              >
                <BookOpen size={16} />
                {selectedBookLoan ? "Borrowed" : "Borrow"}
              </Button>

              <Button
                onClick={() => onReserve(book.id)}
                variant="outline"
                disabled={Boolean(selectedBookReservation)}
              >
                <CalendarClock size={16} />
                {selectedBookReservation ? "Hold placed" : "Place hold"}
              </Button>

              {canManageLibrary && (
                <>
                  <Button
                    onClick={() => onEdit(book)}
                    variant="secondary"
                  >
                    <Upload size={16} />
                    Edit
                  </Button>

                  <Button
                    onClick={() => onDelete(book.id)}
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Availability status */}
        <div className="availability-panel">
          <div>
            <span>Available copies</span>
            <strong>
              {book.availableCopies} of {book.quantity}
            </strong>
          </div>

          <div className="availability-meter" aria-label="Availability">
            <span style={{ width: `${availabilityPercent}%` }} />
          </div>
        </div>

        {/* Book description */}
        <section className="detail-section">
          <h3>Description</h3>

          <p>
            {book.description ||
              "No description has been added for this book yet."}
          </p>
        </section>
      </article>

      {/* User activity */}
      <aside className="book-detail-side">
        <section>
          <h3>Your Activity</h3>

          <dl>
            <div>
              <dt>Loan</dt>

              <dd>
                {selectedBookLoan
                  ? `Due ${formatDate(selectedBookLoan.dueDate)}`
                  : "No active loan"}
              </dd>
            </div>

            <div>
              <dt>Reservation</dt>

              <dd>
                {selectedBookReservation
                  ? `Expires ${formatDate(selectedBookReservation.expiresAt)}`
                  : "No active hold"}
              </dd>
            </div>
          </dl>
        </section>

        {selectedBookLoading && (
          <div className="alert success">Refreshing book...</div>
        )}
      </aside>

      {/* Edit book form */}
      {canManageLibrary && bookForm.id === book.id && (
        <aside className="side-panel detail-edit-panel">
          <h2>Edit book</h2>

          <input
            value={bookForm.title}
            onChange={(e) => onFormFieldChange({ title: e.target.value })}
            placeholder="Title"
          />

          <input
            value={bookForm.author}
            onChange={(e) => onFormFieldChange({ author: e.target.value })}
            placeholder="Author"
          />

          <input
            value={bookForm.isbn}
            onChange={(e) => onFormFieldChange({ isbn: e.target.value })}
            placeholder="ISBN"
          />

          <select
            value={bookForm.genreId}
            onChange={(e) => onFormFieldChange({ genreId: e.target.value })}
          >
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            value={bookForm.publishedYear}
            onChange={(e) =>
              onFormFieldChange({ publishedYear: e.target.value })
            }
            placeholder="Published year"
            type="number"
          />

          <input
            value={bookForm.quantity}
            onChange={(e) => onFormFieldChange({ quantity: e.target.value })}
            placeholder="Quantity"
            type="number"
          />

          <input
            value={bookForm.coverUrl}
            onChange={(e) => onFormFieldChange({ coverUrl: e.target.value })}
            placeholder="Cover image URL"
          />

          <label className="file-control">
            <Upload size={16} />
            <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={coverUploading}
              onChange={(e) => onUploadCover(e.target.files?.[0])}
            />
          </label>

          <textarea
            value={bookForm.description}
            onChange={(e) =>
              onFormFieldChange({ description: e.target.value })
            }
            placeholder="Description"
          />

          <Button onClick={onSaveBook}>
            <Check size={16} />
            Save changes
          </Button>

          <Button onClick={onCancelEdit} variant="outline">
            <X size={16} />
            Close editor
          </Button>
        </aside>
      )}
    </section>
  );
};

export default React.memo(BookDetail);