
import type { PropsWithChildren } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Loan, Reservation, Tab } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { useGenres } from "@/hooks/useGenres";
import { useLoans } from "@/hooks/useLoans";
import { useReservations } from "@/hooks/useReservations";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";
import { useAppHandlers } from "@/hooks/useAppHandlers";

// Define the shape of your context data
interface AppContextType {
  auth: ReturnType<typeof useAuth>;
  books: ReturnType<typeof useBooks>;
  genres: ReturnType<typeof useGenres>;
  loans: ReturnType<typeof useLoans>;
  reservations: ReturnType<typeof useReservations>;
  users: ReturnType<typeof useUsers>;
  toast: ReturnType<typeof useToast>;
  handlers: ReturnType<typeof useAppHandlers>;
  tab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  authMode: "login" | "register";
  setAuthMode: React.Dispatch<React.SetStateAction<"login" | "register">>;
  loginForm: { email: string; password: string; name: string };
  setLoginForm: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; name: string }>
  >;
  coverUploading: boolean;
  loading: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeLoans: Loan[];
  overdueLoans: Loan[];
  selectedBookLoan?: Loan;
  selectedBookReservation?: Reservation;
  loadCore: () => Promise<void>;
  runAsync: (
    promise: Promise<unknown>,
    options?: {
      successMessage?: string;
      onSuccess?: () => void | Promise<void>;
    }
  ) => Promise<void>;
  handleSignIn: () => Promise<void>;
  handleDemoLogin: (role: "admin" | "librarian" | "user") => void;
  getHeaderTitle: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const toast = useToast();
  const auth = useAuth();
  const books = useBooks(auth.token);
  const loans = useLoans(auth.token);
  const reservations = useReservations(auth.token);
  const genres = useGenres(auth.token);
  const users = useUsers(auth.token);

  const [tab, setTab] = useState<Tab>("catalog");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({
    email: "admin@smartlibrary.local",
    password: "",
    name: "",
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const loadingRef = useRef(false);

  const activeLoans = loans.loans.filter((l) => l.status === "ACTIVE");
  const overdueLoans = activeLoans.filter(
    (l) => new Date(l.dueDate).getTime() < now
  );

  const loadCore = useCallback(async () => {
    if (!auth.token || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const [, genreItems] = await Promise.all([
        Promise.resolve(),
        genres.loadGenres(),
      ]);
      await Promise.all([
        books.loadBooks(),
        loans.loadLoans(),
        reservations.loadReservations(),
      ]);
      if (!books.bookForm.genreId && genreItems[0]) {
        books.setBookForm((prev) => ({ ...prev, genreId: genreItems[0].id }));
      }
    } catch (error_) {
      console.error("Load failed:", error_);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [
    auth.token,
    books.loadBooks,
    books.setBookForm,
    books.bookForm.genreId,
    genres.loadGenres,
    loans.loadLoans,
    reservations.loadReservations,
  ]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      void loadCore();
    }
  }, [auth.isAuthenticated, loadCore]);

  useEffect(() => {
    if (auth.canManageUsers && auth.isAuthenticated) {
      void users.loadUsers();
    }
  }, [auth.canManageUsers, auth.isAuthenticated, users.loadUsers]);

  const runAsync = useCallback(
    async (
      promise: Promise<unknown>,
      options?: {
        successMessage?: string;
        onSuccess?: () => void | Promise<void>;
      }
    ) => {
      try {
        await promise;
        if (options?.successMessage) {
          toast.showToast(options.successMessage);
        }
        if (options?.onSuccess) {
          await options.onSuccess();
        }
      } catch (err) {
        toast.showError(err);
      }
    },
    [toast.showError, toast.showToast]
  );

  const handlers = useAppHandlers(
    { auth, books, loans, reservations, genres, users, toast },
    loadCore,
    runAsync,
    setCoverUploading
  );

  const handleSignIn = async () => {
    const email = loginForm.email.trim().toLowerCase();
    if (!email || !loginForm.password) {
      toast.showToast("Enter your email and password.", "destructive");
      return;
    }
    try {
      setLoading(true);
      await auth.signIn(email, loginForm.password, loginForm.name, authMode);
      toast.showToast(authMode === "login" ? "Signed in" : "Account created");
    } catch (error_) {
      toast.showError(error_);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "librarian" | "user") => {
    setLoginForm({
      email: `${role}@smartlibrary.local`,
      password: "",
      name: "",
    });
  };

  const getHeaderTitle = () => {
    if (books.selectedBook) return "Book Details";
    if (tab === "catalog") return "Library Catalog";
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  const selectedBookLoan = useMemo(
    () =>
      books.selectedBook
        ? loans.loans.find(
            (l) => l.bookId === books.selectedBook!.id && l.status === "ACTIVE"
          )
        : undefined,
    [books.selectedBook, loans.loans]
  );

  const selectedBookReservation = useMemo(
    () =>
      books.selectedBook
        ? reservations.reservations.find(
            (r) =>
              r.bookId === books.selectedBook!.id && r.status === "PENDING"
          )
        : undefined,
    [books.selectedBook, reservations.reservations]
  );

  const value = {
    auth,
    books,
    genres,
    loans,
    reservations,
    users,
    toast,
    handlers,
    tab,
    setTab,
    authMode,
    setAuthMode,
    loginForm,
    setLoginForm,
    coverUploading,
    loading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeLoans,
    overdueLoans,
    selectedBookLoan,
    selectedBookReservation,
    loadCore,
    runAsync,
    handleSignIn,
    handleDemoLogin,
    getHeaderTitle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
