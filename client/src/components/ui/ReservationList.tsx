import { Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";
import { useAppContext } from "@/contexts/AppContext";

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
    PENDING: "warning",
    FULFILLED: "success",
    CANCELLED: "secondary",
    EXPIRED: "outline",
};

export function ReservationList() {
    const {
        reservations: { reservations },
        auth: { canManageLibrary },
        handlers: { handleFulfillReservation, handleCancelReservation },
    } = useAppContext();

    return (
        <div className="space-y-3">
            {reservations.map((reservation) => (
                <Card key={reservation.id} className="transition-all hover:shadow-sm">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {reservation.bookId}
                                </p>
                                <Badge
                                    variant={statusColors[reservation.status] ?? "outline"}
                                    className="shrink-0 text-[10px]"
                                >
                                    {reservation.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Expires {formatDate(reservation.expiresAt)}
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                            {canManageLibrary && reservation.status === "PENDING" && (
                                <Button
                                    onClick={() => handleFulfillReservation(reservation.id)}
                                    size="sm"
                                    className="h-8"
                                >
                                    <Check size={12} />
                                    <span className="hidden sm:inline">Fulfill</span>
                                </Button>
                            )}
                            <Button
                                onClick={() => handleCancelReservation(reservation.id)}
                                size="sm"
                                variant="outline"
                                className="h-8"
                            >
                                <X size={12} />
                                <span className="hidden sm:inline">Cancel</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {!reservations.length && (
                <EmptyState
                    icon={RefreshCw}
                    title="No reservations"
                    text="Placed holds will show up here."
                />
            )}
        </div>
    );
}

