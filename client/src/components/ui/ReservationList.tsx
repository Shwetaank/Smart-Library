import { Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";
import type { Reservation } from "@/types";

type ReservationListProps = {
    reservations: Reservation[];
    canManageLibrary: boolean;
    onFulfill: (id: string) => void;
    onCancel: (id: string) => void;
};

export function ReservationList({
    reservations,
    canManageLibrary,
    onFulfill,
    onCancel,
}: ReservationListProps) {
    return (
        <section className="table-panel">
            {reservations.map((reservation) => (
                <article className="list-row" key={reservation.id}>
                    <div>
                        <strong>{reservation.bookId}</strong>
                        <span>
                            {reservation.status} expires{" "}
                            {formatDate(reservation.expiresAt)}
                        </span>
                    </div>
                    <div className="row-actions">
                        {canManageLibrary && reservation.status === "PENDING" && (
                            <Button
                                onClick={() => onFulfill(reservation.id)}
                                size="sm"
                            >
                                <Check size={14} />
                                Fulfill
                            </Button>
                        )}
                        <Button
                            onClick={() => onCancel(reservation.id)}
                            size="sm"
                            variant="outline"
                        >
                            <X size={14} />
                            Cancel
                        </Button>
                    </div>
                </article>
            ))}
            {!reservations.length && (
                <EmptyState
                    icon={RefreshCw}
                    title="No reservations"
                    text="Placed holds will show up here."
                />
            )}
        </section>
    );
}

