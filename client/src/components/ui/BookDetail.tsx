import React from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Pencil,
  Trash2,
  Upload,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, toBookForm } from "@/lib/api";
import type { Book } from "@/types";
import { emptyBookForm } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

const BookDetail = () => {
  const {
    books,
    genres,
    selectedBookLoan,
    selectedBookReservation,
    coverUploading,
    auth,
    handlers,
  } = useAppContext();

  const {
    handleBorrow,
    handleReserve,
    handleSaveBook,
    handleDeleteBook,
    handleUploadCover,
  } = handlers;
  
  const book = books.selectedBook;

  if (!book) {
    return null;
  }

  const availabilityPercent = Math.max(
    0,
    Math.min(100, (book.availableCopies / book.quantity) * 100),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={books.closeBook} className="gap-1.5">
          <ArrowLeft size={16} />
          Back to catalog
        </Button>

        {/* Book Hero */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Cover */}
              <div className="flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-4xl font-bold text-white shadow-md">
                {book.coverUrl ? (
                  <img alt={`${book.title} cover`} src={book.coverUrl} className="h-full w-full object-cover" />
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
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.availableCopies <= 0 || Boolean(selectedBookLoan)}
                  >
                    <BookOpen size={14} />
                    {selectedBookLoan ? "Borrowed" : "Borrow"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReserve(book.id)}
                    disabled={Boolean(selectedBookReservation)}
                  >
                    <CalendarClock size={14} />
                    {selectedBookReservation ? "Hold placed" : "Place hold"}
                  </Button>

                  {auth.canManageLibrary && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => books.setBookForm(toBookForm(book))}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBook(book.id)}
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available copies</span>
              <span className="text-sm font-semibold">
                {book.availableCopies} of {book.quantity}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${availabilityPercent > 50
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              {book.description || "No description has been added for this book yet."}
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
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Loan</p>
              <p className="text-sm font-medium">
                {selectedBookLoan
                  ? `Due ${formatDate(selectedBookLoan.dueDate)}`
                  : "No active loan"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Reservation</p>
              <p className="text-sm font-medium">
                {selectedBookReservation
                  ? `Expires ${formatDate(selectedBookReservation.expiresAt)}`
                  : "No active hold"}
              </p>
            </div>
          </CardContent>
        </Card>

        {books.selectedBookLoading && (
          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
            <CardContent className="py-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 animate-pulse">
                Refreshing book...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Book Form */}
        {auth.canManageLibrary && books.bookForm.id === book.id && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Edit book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={books.bookForm.title}
                onChange={(e) => books.setBookForm((prev) => ({...prev, title: e.target.value }))}
                placeholder="Title"
              />
              <Input
                value={books.bookForm.author}
                onChange={(e) => books.setBookForm((prev) => ({...prev, author: e.target.value }))}
                placeholder="Author"
              />
              <Input
                value={books.bookForm.isbn}
                onChange={(e) => books.setBookForm((prev) => ({...prev, isbn: e.target.value }))}
                placeholder="ISBN"
              />
              <select
                value={books.bookForm.genreId}
                onChange={(e) => books.setBookForm((prev) => ({...prev, genreId: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {genres.genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <Input
                value={books.bookForm.publishedYear}
                onChange={(e) => books.setBookForm((prev) => ({...prev, publishedYear: e.target.value }))}
                placeholder="Published year"
                type="number"
              />
              <Input
                value={books.bookForm.quantity}
                onChange={(e) => books.setBookForm((prev) => ({...prev, quantity: e.target.value }))}
                placeholder="Quantity"
                type="number"
              />
              <Input
                value={books.bookForm.coverUrl}
                onChange={(e) => books.setBookForm((prev) => ({...prev, coverUrl: e.target.value }))}
                placeholder="Cover image URL"
              />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                <Upload size={14} />
                <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={coverUploading}
                  className="hidden"
                  onChange={(e) => handleUploadCover(e.target.files?.[0])}
                />
              </label>
              <textarea
                value={books.bookForm.description}
                onChange={(e) => books.setBookForm((prev) => ({...prev, description: e.target.value }))}
                placeholder="Description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-y"
              />
              <Button onClick={handleSaveBook} className="w-full">
                <Check size={14} />
                Save changes
              </Button>
              <Button onClick={() => books.setBookForm({...emptyBookForm, genreId: genres.genres[0]?.id ?? ""})} variant="outline" className="w-full">
                <X size={14} />
                Close editor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default React.memo(BookDetail);

