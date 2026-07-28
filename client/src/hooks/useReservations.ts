import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Reservation } from "@/types";

export function useReservations(token: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadReservations = useCallback(async () => {
    const rows = await apiRequest<Reservation[]>("/reservations", token);
    setReservations(rows);
    return rows;
  }, [token]);

  const reserveBook = useCallback(
    async (bookId: string) => {
      await apiRequest<Reservation>("/reservations", token, {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
    },
    [token],
  );

  const cancelReservation = useCallback(
    async (id: string) => {
      await apiRequest<Reservation>(`/reservations/${id}`, token, {
        method: "DELETE",
      });
    },
    [token],
  );

  const fulfillReservation = useCallback(
    async (id: string) => {
      await apiRequest<Reservation>(`/reservations/${id}/fulfill`, token, {
        method: "POST",
      });
    },
    [token],
  );

  return {
    reservations,
    setReservations,
    loadReservations,
    reserveBook,
    cancelReservation,
    fulfillReservation,
  };
}
