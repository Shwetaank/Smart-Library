import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Loan } from "@/types";

export function useLoans(token: string) {
  // Loan state
  const [loans, setLoans] = useState<Loan[]>([]);

  // Load loans
  const loadLoans = useCallback(async () => {
    const rows = await apiRequest<Loan[]>("/loans/history", token);

    setLoans(rows);

    return rows;
  }, [token]);

  // Borrow book
  const borrowBook = useCallback(
    async (bookId: string) => {
      await apiRequest<Loan>("/loans/borrow", token, {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
    },
    [token]
  );

  // Return loan
  const returnLoan = useCallback(
    async (loanId: string) => {
      await apiRequest<Loan>("/loans/return", token, {
        method: "POST",
        body: JSON.stringify({ loanId }),
      });
    },
    [token]
  );

  // Renew loan
  const renewLoan = useCallback(
    async (loanId: string) => {
      await apiRequest<Loan>("/loans/renew", token, {
        method: "POST",
        body: JSON.stringify({ loanId }),
      });
    },
    [token]
  );

  return useMemo(
    () => ({
      loans,
      setLoans,
      loadLoans,
      borrowBook,
      returnLoan,
      renewLoan,
    }),
    [loans, loadLoans, borrowBook, returnLoan, renewLoan]
  );
}
