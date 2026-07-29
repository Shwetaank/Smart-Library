import type { ComponentType } from "react";

// Common types
export type Role = "USER" | "LIBRARIAN" | "ADMIN";

export type Tab = "catalog" | "loans" | "reservations" | "genres" | "users";

export type NavItem = [Tab, ComponentType<{ size?: number }>, string];

// API types
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

// Domain models
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

// Authentication
export type LoginResult = {
  token: string;
  user: User;
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

// Default values
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

// API configuration
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "https://smart-library-lpbd.onrender.com/api/v1";
