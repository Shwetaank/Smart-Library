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

function App() {
  // --- Hooks ---
  const { toast, showToast, showError, dismissToast } = useToast();
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
      showError(error_);
    } finally {
      setLoading(false);
    }
  }, [auth, books, genres, loans, reservations, showError]);

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
          showToast(options.successMessage);
        }
        if (options?.onSuccess) {
          await options.onSuccess();
        }
      } catch (err) {
        showError(err);
      }
    },
    [showError, showToast]
  );

  // --- Auth handlers ---
  const handleSignIn = async () => {
    const email = loginForm.email.trim().toLowerCase();
    if (!email || !loginForm.password) {
      showToast("Enter your email and password.", "destructive");
      return;
    }
    try {
      setLoading(true);
      await auth.signIn(email, loginForm.password, loginForm.name, authMode);
      showToast(authMode === "login" ? "Signed in" : "Account created");
    } catch (error_) {
      showError(error_);
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

  // --- Book handlers ---
  const handleBorrow = async (bookId: string) => {
    await runAsync(loans.borrowBook(bookId), {
      successMessage: "Book borrowed",
      onSuccess: async () => {
        await loadCore();
        await books.openBook(bookId);
      },
    });
  };

  const handleReserve = async (bookId: string) => {
    await runAsync(reservations.reserveBook(bookId), {
      successMessage: "Reservation placed",
      onSuccess: async () => {
        await loadCore();
        await books.openBook(bookId);
      },
    });
  };

  const handleSaveBook = async () => {
    try {
      const detailId = await books.saveBook(genres.genres);
      const isNew = !books.bookForm.id;
      showToast(isNew ? "Book added" : "Book updated");
      await loadCore();
      if (detailId && (books.selectedBook || isNew)) {
        await books.openBook(detailId);
      }
    } catch (error_) {
      showError(error_);
    }
  };

  const handleDeleteBook = (id: string) =>
    runAsync(books.deleteBook(id), {
      successMessage: "Book removed",
      onSuccess: loadCore,
    });

  const handleUploadCover = async (file?: File) => {
    if (!file) return;
    try {
      setCoverUploading(true);
      const coverUrl = await books.uploadCover(file);
      books.setBookForm((prev) => ({ ...prev, coverUrl }));

      if (books.bookForm.id) {
        await books.openBook(books.bookForm.id);
        await loadCore();
      }
      showToast(
        books.bookForm.id ? "Cover uploaded and saved" : "Cover uploaded"
      );
    } catch (error_) {
      showError(error_);
    } finally {
      setCoverUploading(false);
    }
  };

  // --- Loan handlers ---
  const handleReturnLoan = (loanId: string) =>
    runAsync(loans.returnLoan(loanId), {
      successMessage: "Book returned",
      onSuccess: loadCore,
    });

  const handleRenewLoan = (loanId: string) =>
    runAsync(loans.renewLoan(loanId), {
      successMessage: "Loan renewed",
      onSuccess: loadCore,
    });

  // --- Reservation handlers ---
  const handleCancelReservation = (id: string) =>
    runAsync(reservations.cancelReservation(id), {
      successMessage: "Reservation cancelled",
      onSuccess: loadCore,
    });

  const handleFulfillReservation = (id: string) =>
    runAsync(reservations.fulfillReservation(id), {
      successMessage: "Reservation fulfilled",
      onSuccess: loadCore,
    });

  // --- Genre handlers ---
  const handleSaveGenre = (name: string) =>
    runAsync(genres.saveGenre(name), {
      successMessage: "Genre added",
      onSuccess: loadCore,
    });

  const handleDeleteGenre = (id: string) =>
    runAsync(genres.deleteGenre(id), {
      successMessage: "Genre removed",
      onSuccess: loadCore,
    });

  // --- User handlers ---
  const handleUpdateUserRole = (id: string, role: string) =>
    runAsync(users.updateUserRole(id, role), {
      successMessage: "Role updated",
      onSuccess: users.loadUsers,
    });

  const handleDeleteUser = (id: string) =>
    runAsync(users.deleteUser(id), {
      successMessage: "User deactivated",
      onSuccess: users.loadUsers,
    });

  // --- Profile handler ---
  const handleSaveProfile = () =>
    runAsync(auth.saveProfile(auth.profileName), {
      successMessage: "Profile updated",
    });

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
        <Toast toast={toast} onDismiss={dismissToast} />
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
      handleBorrow={handleBorrow}
      handleReserve={handleReserve}
      handleSaveBook={handleSaveBook}
      handleDeleteBook={handleDeleteBook}
      handleUploadCover={handleUploadCover}
      handleReturnLoan={handleReturnLoan}
      handleRenewLoan={handleRenewLoan}
      handleCancelReservation={handleCancelReservation}
      handleFulfillReservation={handleFulfillReservation}
      handleSaveGenre={handleSaveGenre}
      handleDeleteGenre={handleDeleteGenre}
      handleUpdateUserRole={handleUpdateUserRole}
      handleDeleteUser={handleDeleteUser}
      handleSaveProfile={handleSaveProfile}
      getHeaderTitle={getHeaderTitle}
      selectedBookLoan={selectedBookLoan}
      selectedBookReservation={selectedBookReservation}
      toast={toast}
      dismissToast={dismissToast}
    />
  );
}

export default App;

