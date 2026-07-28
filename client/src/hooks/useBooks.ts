import { useCallback, useState } from "react";
import { apiRequest, toBookPayload } from "@/lib/api";
import type { Book, BookForm, Genre, PageResult } from "@/types";
import { emptyBookForm } from "@/types";

export function useBooks(token: string) {
  const [books, setBooks] = useState<PageResult<Book>>({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookLoading, setSelectedBookLoading] = useState(false);
  const [bookForm, setBookForm] = useState<BookForm>(emptyBookForm);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const loadBooks = useCallback(
    async (genreId?: string) => {
      const gid = genreId ?? selectedGenre;
      const bookPage = await apiRequest<PageResult<Book>>(
        `/books?limit=12&search=${encodeURIComponent(search)}&genreId=${encodeURIComponent(gid)}`,
        token,
      );
      setBooks(bookPage);
      return bookPage;
    },
    [token, search, selectedGenre],
  );

  const openBook = useCallback(
    async (id: string) => {
      setSelectedBookLoading(true);
      try {
        const book = await apiRequest<Book>(`/books/${id}`, token);
        setSelectedBook(book);
        return book;
      } finally {
        setSelectedBookLoading(false);
      }
    },
    [token],
  );

  const closeBook = useCallback(() => setSelectedBook(null), []);

  const saveBook = useCallback(
    async (genres: Genre[]) => {
      const payload = toBookPayload(bookForm);
      let detailBookId: string | undefined;
      if (bookForm.id) {
        const updated = await apiRequest<Book>(`/books/${bookForm.id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        detailBookId = updated.id;
      } else {
        const created = await apiRequest<Book>("/books", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        detailBookId = created.id;
      }
      setBookForm({ ...emptyBookForm, genreId: genres[0]?.id ?? "" });
      return detailBookId;
    },
    [bookForm, token],
  );

  const deleteBook = useCallback(
    async (id: string) => {
      await apiRequest<null>(`/books/${id}`, token, { method: "DELETE" });
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
    },
    [token, selectedBook],
  );

  const uploadCover = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiRequest<{ coverUrl: string }>(
        "/uploads/cover",
        token,
        {
          method: "POST",
          body: formData,
        },
      );
      return result.coverUrl;
    },
    [token],
  );

  return {
    books,
    selectedBook,
    selectedBookLoading,
    bookForm,
    search,
    selectedGenre,
    setBooks,
    setSelectedBook,
    setBookForm,
    setSearch,
    setSelectedGenre,
    loadBooks,
    openBook,
    closeBook,
    saveBook,
    deleteBook,
    uploadCover,
  };
}
