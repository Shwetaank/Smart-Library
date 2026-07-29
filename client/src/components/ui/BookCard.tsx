import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarClock, Hash, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";

type BookCardProps = {
    book: Book;
    onOpen: (id: string) => Promise<unknown>;
    onBorrow: (id: string) => Promise<unknown>;
    onReserve: (id: string) => Promise<unknown>;
    onEdit: (book: Book) => void;
    onDelete: (id: string) => Promise<unknown>;
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

    const availabilityColor =
        availabilityRatio > 50
            ? "bg-emerald-500"
            : availabilityRatio > 0
                ? "bg-amber-500"
                : "bg-red-500";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative overflow-hidden border-border/70 transition-all hover:shadow-lg">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500/80 via-cyan-500/80 to-blue-500/80 opacity-70" />
                <CardContent className="p-0">
                    <div className="flex gap-3 p-4">
                        <div className="relative flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-linear-to-br from-emerald-500 to-cyan-500 text-lg font-bold text-white shadow-sm">
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt={`${book.title} cover`}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <span>{book.title.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
                                    {book.genre?.name ?? "Uncategorized"}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">#{book.id.slice(0, 6)}</span>
                            </div>

                            <h3
                                className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-500"
                                title={book.title}
                            >
                                {book.title}
                            </h3>

                            <p className="truncate text-xs text-muted-foreground" title={book.author}>
                                {book.author}
                            </p>

                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>Availability</span>
                                    <span className="font-medium">
                                        {book.availableCopies}/{book.quantity}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${availabilityRatio}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className={`h-full rounded-full ${availabilityColor}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t border-border bg-muted/20 px-4 py-2.5">
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
                            <div className="ml-auto flex gap-1.5">
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
                                    className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                                    onClick={() => onDelete(book.id)}
                                    title="Delete book"
                                >
                                    <Trash2 size={12} />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default React.memo(BookCard);

