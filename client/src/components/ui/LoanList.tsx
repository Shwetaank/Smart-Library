import { CalendarClock, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";
import type { Loan } from "@/types";

type LoanListProps = {
    loans: Loan[];
    onReturn: (loanId: string) => void;
    onRenew: (loanId: string) => void;
};

export function LoanList({ loans, onReturn, onRenew }: LoanListProps) {
    return (
        <section className="table-panel">
            {loans.map((loan) => (
                <article className="list-row" key={loan.id}>
                    <div>
                        <strong>{loan.book?.title ?? loan.bookId}</strong>
                        <span>
                            {loan.status} due {formatDate(loan.dueDate)}
                        </span>
                    </div>
                    {loan.status === "ACTIVE" && (
                        <div className="row-actions">
                            <Button
                                onClick={() => onRenew(loan.id)}
                                size="sm"
                                variant="outline"
                            >
                                <RotateCcw size={14} />
                                Renew
                            </Button>
                            <Button onClick={() => onReturn(loan.id)} size="sm">
                                <Check size={14} />
                                Return
                            </Button>
                        </div>
                    )}
                </article>
            ))}
            {!loans.length && (
                <EmptyState
                    icon={CalendarClock}
                    title="No loans yet"
                    text="Borrowed books will appear here."
                />
            )}
        </section>
    );
}

