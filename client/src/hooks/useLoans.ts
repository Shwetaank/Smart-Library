import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Loan } from "@/types";

export function useLoans(token: string) {
  const [loans, setLoans] = useState<Loan[]>([]);

  const loadLoans = useCallback(async () => {
    const rows = await apiRequest<Loan[]>("/loans/history", token);
    setLoans(rows);
    return rows;
  }, [token]);

  const borrowBook = useCallback(
    async (bookId: string) => {
      await apiRequest<Loan>("/loans/borrow", token, {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
    },
    [token],
  );

  const returnLoan = useCallback(
    async (loanId: string) => {
      await apiRequest<Loan>("/loans/return", token, {
        method: "POST",
        body: JSON.stringify({ loanId }),
      });
    },
    [token],
  );

  const renewLoan = useCallback(
    async (loanId: string) => {
      await apiRequest<Loan>("/loans/renew", token, {
        method: "POST",
        body: JSON.stringify({ loanId }),
      });
    },
    [token],
  );

  return { loans, setLoans, loadLoans, borrowBook, returnLoan, renewLoan };
}
