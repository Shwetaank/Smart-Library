import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { Book, BookForm, Genre, Loan, Reservation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/api";

interface BookDetailProps {
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
}

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
          <ArrowLeft size={16} />
          Back to catalog
        </Button>

        {/* Book Hero */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Cover */}
              <div className="flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-emerald-500 to-cyan-500 text-4xl font-bold text-white shadow-md">
                {book.coverUrl ? (
                  <img
                    alt={`${book.title} cover`}
                    src={book.coverUrl}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  book.title.slice(0, 1)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <Badge variant="secondary" className="w-fit">
                  {book.genre?.name ?? "Uncategorized"}
                </Badge>

                <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                  {book.title}
                </h2>

                <p className="text-sm text-muted-foreground">by {book.author}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onBorrow(book.id)}
                    disabled={
                      book.availableCopies <= 0 || Boolean(selectedBookLoan)
                    }
                  >
                    <BookOpen size={14} />
                    {selectedBookLoan ? "Borrowed" : "Borrow"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReserve(book.id)}
                    disabled={Boolean(selectedBookReservation)}
                  >
                    <CalendarClock size={14} />
                    {selectedBookReservation ? "Hold placed" : "Place hold"}
                  </Button>

                  {canManageLibrary && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(book)}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(book.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available copies
              </span>
              <span className="text-sm font-semibold">
                {book.availableCopies} of {book.quantity}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  availabilityPercent > 50
                    ? "bg-emerald-500"
                    : availabilityPercent > 0
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-sm text-muted-foreground">
              {book.description ||
                "No description has been added for this book yet."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Loan
              </p>
              <p className="text-sm font-medium">
                {selectedBookLoan
                  ? `Due ${formatDate(selectedBookLoan.dueDate)}`
                  : "No active loan"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Reservation
              </p>
              <p className="text-sm font-medium">
                {selectedBookReservation
                  ? `Expires ${formatDate(selectedBookReservation.expiresAt)}`
                  : "No active hold"}
              </p>
            </div>
          </CardContent>
        </Card>

        {selectedBookLoading && (
          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
            <CardContent className="py-3">
              <p className="animate-pulse text-xs text-emerald-700 dark:text-emerald-300">
                Refreshing book...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Book Form (Slide-over style on side) */}
        <AnimatePresence>
          {canManageLibrary && bookForm.id === book.id && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-emerald-200/70 shadow-sm dark:border-emerald-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Edit book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={bookForm.title}
                    onChange={(e) => onFormFieldChange({ title: e.target.value })}
                    placeholder="Title"
                  />
                  <Input
                    value={bookForm.author}
                    onChange={(e) =>
                      onFormFieldChange({ author: e.target.value })
                    }
                    placeholder="Author"
                  />
                  <Input
                    value={bookForm.isbn}
                    onChange={(e) => onFormFieldChange({ isbn: e.target.value })}
                    placeholder="ISBN"
                  />
                  <select
                    value={bookForm.genreId}
                    onChange={(e) =>
                      onFormFieldChange({ genreId: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={bookForm.publishedYear}
                    onChange={(e) =>
                      onFormFieldChange({ publishedYear: e.target.value })
                    }
                    placeholder="Published year"
                    type="number"
                  />
                  <Input
                    value={bookForm.quantity}
                    onChange={(e) =>
                      onFormFieldChange({ quantity: e.target.value })
                    }
                    placeholder="Quantity"
                    type="number"
                  />
                  <Input
                    value={bookForm.coverUrl}
                    onChange={(e) =>
                      onFormFieldChange({ coverUrl: e.target.value })
                    }
                    placeholder="Cover image URL"
                  />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                    <Upload size={14} />
                    <span>
                      {coverUploading ? "Uploading..." : "Upload cover"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={coverUploading}
                      className="hidden"
                      onChange={(e) => onUploadCover(e.target.files?.[0])}
                    />
                  </label>
                  <textarea
                    value={bookForm.description}
                    onChange={(e) =>
                      onFormFieldChange({ description: e.target.value })
                    }
                    placeholder="Description"
                    className="flex min-h-20 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  />
                  <Button onClick={onSaveBook} className="w-full">
                    <Check size={14} />
                    Save changes
                  </Button>
                  <Button
                    onClick={onCancelEdit}
                    variant="outline"
                    className="w-full"
                  >
                    <X size={14} />
                    Close editor
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(BookDetail);