import { API_BASE, type ApiResponse, type Book, type BookForm } from "@/types";

export async function apiRequest<T>(
  path: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.message ?? `Request failed with ${response.status}`,
    );
  }

  return payload.data;
}

export function toBookPayload(form: BookForm) {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    isbn: form.isbn.trim(),
    description: form.description.trim() || undefined,
    publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
    genreId: form.genreId,
    coverUrl: form.coverUrl || undefined,
    quantity: Number(form.quantity || 1),
  };
}

export function toBookForm(book: Book): BookForm {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description ?? "",
    publishedYear: String(book.publishedYear ?? ""),
    genreId: book.genreId,
    coverUrl: book.coverUrl ?? "",
    quantity: String(book.quantity),
  };
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}
