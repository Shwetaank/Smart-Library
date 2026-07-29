import React from "react";
import { BookOpen, CalendarClock, Hash, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    const availabilityRatio = book.quantity > 0
        ? Math.round((book.availableCopies / book.quantity) * 100)
        : 0;

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-0">
                <div className="flex gap-3 p-4">
                    {/* Book cover */}
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 text-lg font-bold text-white shadow-sm">
                        {book.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={`${book.title} cover`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <span>{book.title.charAt(0).toUpperCase()}</span>
                        )}
                    </div>

                    {/* Book info */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
                            {book.genre?.name ?? "Uncategorized"}
                        </Badge>

                        <h3
                            className="truncate text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors"
                            title={book.title}
                        >
                            {book.title}
                        </h3>

                        <p className="truncate text-xs text-muted-foreground" title={book.author}>
                            {book.author}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${availabilityRatio > 50
                                            ? "bg-emerald-500"
                                            : availabilityRatio > 0
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                        }`}
                                    style={{ width: `${availabilityRatio}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                {book.availableCopies}/{book.quantity}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5 border-t border-border bg-muted/30 px-4 py-2.5">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => onOpen(book.id)}
                    >
                        <Hash size={12} />
                        Details
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={book.availableCopies <= 0}
                        onClick={() => onBorrow(book.id)}
                    >
                        <BookOpen size={12} />
                        Borrow
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => onReserve(book.id)}
                    >
                        <CalendarClock size={12} />
                        Hold
                    </Button>

                    {canManageLibrary && (
                        <>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => onEdit(book)}
                                title="Edit book"
                            >
                                <Pencil size={12} />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                onClick={() => onDelete(book.id)}
                                title="Delete book"
                            >
                                <Trash2 size={12} />
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(BookCard);

