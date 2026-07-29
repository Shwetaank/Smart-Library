import { motion } from "framer-motion";
import { Check, RefreshCw, X } from "lucide-react";

import type { Reservation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/api";

interface ReservationListProps {
  reservations: Reservation[];
  canManageLibrary: boolean;
  onFulfill: (id: string) => void;
  onCancel: (id: string) => void;
}

const statusColors: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "outline"
> = {
  PENDING: "warning",
  FULFILLED: "success",
  CANCELLED: "secondary",
  EXPIRED: "outline",
};

export function ReservationList({
  reservations,
  canManageLibrary,
  onFulfill,
  onCancel,
}: ReservationListProps) {
  return (
    <div className="space-y-3">
      {reservations.map((reservation, index) => (
        <motion.div
          key={reservation.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Card className="transition-all hover:shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 flex-1 space-y-1">
                <div
                  className="mr-3 w-1 shrink-0 rounded-full bg-muted"
                  style={{
                    background:
                      reservation.status === "EXPIRED"
                        ? "oklch(0.54 0.1 255)"
                        : reservation.status === "PENDING"
                          ? "oklch(0.62 0.13 37)"
                          : reservation.status === "FULFILLED"
                            ? "oklch(0.65 0.13 176)"
                            : "oklch(0.75 0.02 250)",
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
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
              </div>

              <div className="flex shrink-0 gap-2">
                {canManageLibrary && reservation.status === "PENDING" && (
                  <Button
                    onClick={() => onFulfill(reservation.id)}
                    size="sm"
                    className="h-8"
                  >
                    <Check size={12} />
                    <span className="hidden sm:inline">Fulfill</span>
                  </Button>
                )}
                <Button
                  onClick={() => onCancel(reservation.id)}
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
        </motion.div>
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