import { CalendarClock, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";
import { useAppContext } from "@/contexts/AppContext";

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    ACTIVE: "success",
    OVERDUE: "destructive",
    RETURNED: "secondary",
};

export function LoanList() {
    const {
        loans: { loans },
        handlers: { handleReturnLoan, handleRenewLoan },
    } = useAppContext();

    return (
        <div className="space-y-3">
            {loans.map((loan) => (
                <Card key={loan.id} className="transition-all hover:shadow-sm">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {loan.book?.title ?? loan.bookId}
                                </p>
                                <Badge
                                    variant={statusColors[loan.status] ?? "outline"}
                                    className="shrink-0 text-[10px]"
                                >
                                    {loan.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Due {formatDate(loan.dueDate)}
                                {loan.fineAmount && Number(loan.fineAmount) > 0 && (
                                    <span className="ml-2 text-red-500">
                                        Fine: ${Number(loan.fineAmount).toFixed(2)}
                                    </span>
                                )}
                            </p>
                        </div>

                        {loan.status === "ACTIVE" && (
                            <div className="flex shrink-0 gap-2">
                                <Button
                                    onClick={() => handleRenewLoan(loan.id)}
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                >
                                    <RotateCcw size={12} />
                                    <span className="hidden sm:inline">Renew</span>
                                </Button>
                                <Button
                                    onClick={() => handleReturnLoan(loan.id)}
                                    size="sm"
                                    className="h-8"
                                >
                                    <Check size={12} />
                                    <span className="hidden sm:inline">Return</span>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {!loans.length && (
                <EmptyState
                    icon={CalendarClock}
                    title="No loans yet"
                    text="Borrowed books will appear here."
                />
            )}
        </div>
    );
}

