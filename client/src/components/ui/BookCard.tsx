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
    onOpen: (id: string) => void;
    onBorrow: (id: string) => void;
    onReserve: (id: string) => void;
    onEdit: (book: Book) => void;
    onDelete: (id: string) => void;
    canManageLibrary: boolean;
};

export function BookCard({
    book,
    onOpen,
    onBorrow,
    onReserve,
    onEdit,
    onDelete,
    canManageLibrary,
}: BookCardProps) {
    return (
        <article className="book-card">
            <div className="book-cover">
                {book.coverUrl ? (
                    <img alt={`${book.title} cover`} src={book.coverUrl} />
                ) : (
                    book.title.slice(0, 1)
                )}
            </div>
            <div className="book-body">
                <span>{book.genre?.name ?? "Uncategorized"}</span>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <small>
                    {book.availableCopies}/{book.quantity} available
                </small>
            </div>
            <div className="row-actions">
                <Button onClick={() => onOpen(book.id)} size="sm" variant="secondary">
                    <Hash size={14} />
                    Details
                </Button>
                <Button
                    onClick={() => onBorrow(book.id)}
                    size="sm"
                    disabled={book.availableCopies <= 0}
                >
                    <BookOpen size={14} />
                    Borrow
                </Button>
                <Button
                    onClick={() => onReserve(book.id)}
                    size="sm"
                    variant="outline"
                >
                    <CalendarClock size={14} />
                    Hold
                </Button>
                {canManageLibrary && (
                    <>
                        <Button
                            onClick={() => onEdit(book)}
                            size="sm"
                            variant="secondary"
                        >
                            <Upload size={14} />
                        </Button>
                        <Button
                            onClick={() => onDelete(book.id)}
                            size="sm"
                            variant="destructive"
                        >
                            <Trash2 size={14} />
                        </Button>
                    </>
                )}
            </div>
        </article>
    );
}

