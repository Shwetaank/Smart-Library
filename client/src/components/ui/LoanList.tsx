import { motion } from "framer-motion";
import { CalendarClock, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";
import type { Loan } from "@/types";

const statusColors: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive" | "outline"
> = {
  ACTIVE: "success",
  OVERDUE: "destructive",
  RETURNED: "secondary",
};

export function LoanList({
  loans,
  onReturn,
  onRenew,
}: {
  loans: Loan[];
  onReturn: (loanId: string) => Promise<void>;
  onRenew: (loanId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
      {loans.map((loan, index) => (
        <motion.div
          key={loan.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Card className="transition-all hover:shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 flex-1 space-y-1">
                <div
                  className="w-1 shrink-0 rounded-full bg-muted mr-3"
                  style={{
                    background:
                      loan.status === "OVERDUE"
                        ? "oklch(0.58 0.19 27)"
                        : loan.status === "ACTIVE"
                          ? "oklch(0.65 0.13 176)"
                          : "oklch(0.75 0.02 250)",
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
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
              </div>

              {loan.status === "ACTIVE" && (
                <div className="flex shrink-0 gap-2">
                  <Button
                    onClick={() => void onRenew(loan.id)}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    <RotateCcw size={12} />
                    <span className="hidden sm:inline">Renew</span>
                  </Button>
                  <Button
                    onClick={() => void onReturn(loan.id)}
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
        </motion.div>
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

