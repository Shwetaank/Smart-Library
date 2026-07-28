import { useCallback, useEffect, useMemo, useState } from "react";

import { LoginForm } from "@/components/ui/LoginForm";
import { Toast } from "@/components/ui/Toast";
import { AuthenticatedApp } from "@/components/views/AuthenticatedApp";
import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { useGenres } from "@/hooks/useGenres";
import { useLoans } from "@/hooks/useLoans";
import { useReservations } from "@/hooks/useReservations";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";
import type { Tab } from "@/types";

import { useAppHandlers } from "@/hooks/useAppHandlers";

function App() {
  // --- Hooks ---
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

  // --- Derived ---
  const activeLoans = loans.loans.filter((l) => l.status === "ACTIVE");
  const overdueLoans = activeLoans.filter(
    (l) => new Date(l.dueDate).getTime() < now
  );

  // --- Core data loader ---
  const loadCore = useCallback(async () => {
    if (!auth.token) return;
    setLoading(true);
    try {
      const [me, genreItems] = await Promise.all([
        auth.loadProfile(),
        genres.loadGenres(),
      ]);
      auth.setProfileName(me.name ?? "");
      await Promise.all([
        books.loadBooks(),
        loans.loadLoans(),
        reservations.loadReservations(),
      ]);
      if (!books.bookForm.genreId && genreItems[0]) {
        books.setBookForm((prev) => ({ ...prev, genreId: genreItems[0].id }));
      }
    } catch (error_) {
      toast.showError(error_);
    } finally {
      setLoading(false);
    }
  }, [auth, books, genres, loans, reservations, toast.showError]);

  useEffect(() => {
    void loadCore();
  }, [loadCore]);

  useEffect(() => {
    if (auth.canManageUsers) {
      void users.loadUsers();
    }
  }, [auth.canManageUsers, users]);

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

  // --- Auth handlers ---
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

  // --- Helpers ---
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

  // ================================================================
  // AUTH SCREEN
  // ================================================================
  if (!auth.isAuthenticated) {
    return (
      <main className="auth-shell">
        <Toast toast={toast.toast} onDismiss={toast.dismissToast} />
        <LoginForm
          authMode={authMode}
          loginForm={loginForm}
          loading={loading}
          onSetAuthMode={setAuthMode}
          onUpdateForm={setLoginForm}
          onSignIn={handleSignIn}
          onDemoLogin={handleDemoLogin}
        />
      </main>
    );
  }

  // ================================================================
  // APP SCREEN
  // ================================================================
  return (
    <AuthenticatedApp
      auth={auth}
      books={books}
      loans={loans}
      reservations={reservations}
      genres={genres}
      users={users}
      tab={tab}
      setTab={setTab}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      loading={loading}
      activeLoans={activeLoans}
      overdueLoans={overdueLoans}
      coverUploading={coverUploading}
      loadCore={loadCore}
      {...handlers}
      getHeaderTitle={getHeaderTitle}
      selectedBookLoan={selectedBookLoan}
      selectedBookReservation={selectedBookReservation}
      toast={toast.toast}
      dismissToast={toast.dismissToast}
    />
  );
}


export default App;

