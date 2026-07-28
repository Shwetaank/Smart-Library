export type Role = "USER" | "LIBRARIAN" | "ADMIN";

export type Tab = "catalog" | "loans" | "reservations" | "genres" | "users";

export type NavItem = [Tab, React.ComponentType<{ size?: number }>, string];

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type Genre = {
  id: string;
  name: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description?: string | null;
  publishedYear?: number | null;
  genreId: string;
  genre?: Genre;
  coverUrl?: string | null;
  quantity: number;
  availableCopies: number;
};

export type Loan = {
  id: string;
  bookId: string;
  status: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string | null;
  renewedCount: number;
  fineAmount: string | number;
  book?: Book;
};

export type Reservation = {
  id: string;
  bookId: string;
  status: string;
  placedAt: string;
  expiresAt: string;
  fulfilledAt?: string | null;
};

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isActive: boolean;
};

export type LoginResult = {
  token: string;
  user: User;
};

export type ToastMessage = {
  id: number;
  title: string;
  variant: "success" | "destructive";
};

export type BookForm = {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  publishedYear: string;
  genreId: string;
  coverUrl: string;
  quantity: string;
};

export const emptyBookForm: BookForm = {
  title: "",
  author: "",
  isbn: "",
  description: "",
  publishedYear: "",
  genreId: "",
  coverUrl: "",
  quantity: "1",
};

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";
