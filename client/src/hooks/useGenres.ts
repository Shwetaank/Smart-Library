import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Genre, PageResult } from "@/types";

export function useGenres(token: string) {
  const [genres, setGenres] = useState<Genre[]>([]);

  const loadGenres = useCallback(async () => {
    const page = await apiRequest<PageResult<Genre>>(
      "/genres?limit=100",
      token,
    );
    setGenres(page.items);
    return page.items;
  }, [token]);

  const saveGenre = useCallback(
    async (name: string) => {
      await apiRequest<Genre>("/genres", token, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    [token],
  );

  const deleteGenre = useCallback(
    async (id: string) => {
      await apiRequest<null>(`/genres/${id}`, token, { method: "DELETE" });
    },
    [token],
  );

  return { genres, setGenres, loadGenres, saveGenre, deleteGenre };
}
