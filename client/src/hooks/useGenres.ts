import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Genre, PageResult } from "@/types";

export function useGenres(token: string) {
  // Genre state
  const [genres, setGenres] = useState<Genre[]>([]);

  // Load genres
  const loadGenres = useCallback(async () => {
    const page = await apiRequest<PageResult<Genre>>(
      "/genres?limit=100",
      token
    );

    setGenres(page.items);

    return page.items;
  }, [token]);

  // Create genre
  const saveGenre = useCallback(
    async (name: string) => {
      await apiRequest<Genre>("/genres", token, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    [token]
  );

  // Delete genre
  const deleteGenre = useCallback(
    async (id: string) => {
      await apiRequest<null>(`/genres/${id}`, token, {
        method: "DELETE",
      });
    },
    [token]
  );

  return useMemo(
    () => ({
      genres,
      setGenres,
      loadGenres,
      saveGenre,
      deleteGenre,
    }),
    [loadGenres, saveGenre, deleteGenre]
  );
}
