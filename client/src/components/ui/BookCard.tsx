import React from "react";
import {
    BookOpen,
    CalendarClock,
    Hash,
    Trash2,
    Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types";

type BookCardProps = {
    book: Book;
    onOpen: (id: string) => Promise<any>;
    onBorrow: (id: string) => Promise<any>;
    onReserve: (id: string) => Promise<any>;
    onEdit: (book: Book) => void;
    onDelete: (id: string) => Promise<any>;
    canManageLibrary: boolean;
};

const BookCard = ({
    book,
    onOpen,
    onBorrow,
    onReserve,
    onEdit,
    onDelete,
    canManageLibrary,
}: BookCardProps) => {
    return (
        <article className="book-card">
            {/* Book cover */}
            <div className="book-cover">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <span>{book.title.charAt(0).toUpperCase()}</span>
                )}
            </div>

            {/* Book details */}
            <div className="book-body">
                <span>{book.genre?.name ?? "Uncategorized"}</span>

                <h2 className="truncate" title={book.title}>
                    {book.title}
                </h2>

                <p className="truncate" title={book.author}>
                    {book.author}
                </p>

                <small>
                    {book.availableCopies}/{book.quantity} available
                </small>
            </div>

            {/* Actions */}
            <div className="row-actions">
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => onOpen(book.id)}
                    aria-label={`View details of ${book.title}`}
                >
                    <Hash size={14} />
                    <span>Details</span>
                </Button>

                <Button
                    type="button"
                    size="sm"
                    disabled={book.availableCopies <= 0}
                    onClick={() => onBorrow(book.id)}
                    aria-label={`Borrow ${book.title}`}
                >
                    <BookOpen size={14} />
                    <span>Borrow</span>
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onReserve(book.id)}
                    aria-label={`Reserve ${book.title}`}
                >
                    <CalendarClock size={14} />
                    <span>Hold</span>
                </Button>

                {canManageLibrary && (
                    <>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => onEdit(book)}
                            title="Edit book"
                            aria-label={`Edit ${book.title}`}
                        >
                            <Upload size={14} />
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(book.id)}
                            title="Delete book"
                            aria-label={`Delete ${book.title}`}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </>
                )}
            </div>
        </article>
    );
};

export default React.memo(BookCard);