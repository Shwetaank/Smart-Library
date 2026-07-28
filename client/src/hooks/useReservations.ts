import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Reservation } from "@/types";

export function useReservations(token: string) {
  // Reservation state
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Load reservations
  const loadReservations = useCallback(async () => {
    const rows = await apiRequest<Reservation[]>("/reservations", token);

    setReservations(rows);

    return rows;
  }, [token]);

  // Reserve book
  const reserveBook = useCallback(
    async (bookId: string) => {
      await apiRequest<Reservation>("/reservations", token, {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
    },
    [token]
  );

  // Cancel reservation
  const cancelReservation = useCallback(
    async (id: string) => {
      await apiRequest<Reservation>(`/reservations/${id}`, token, {
        method: "DELETE",
      });
    },
    [token]
  );

  // Fulfill reservation
  const fulfillReservation = useCallback(
    async (id: string) => {
      await apiRequest<Reservation>(`/reservations/${id}/fulfill`, token, {
        method: "POST",
      });
    },
    [token]
  );

  return useMemo(
    () => ({
      reservations,
      setReservations,
      loadReservations,
      reserveBook,
      cancelReservation,
      fulfillReservation,
    }),
    [loadReservations, reserveBook, cancelReservation, fulfillReservation]
  );
}
