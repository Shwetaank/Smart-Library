import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Library,
  LogOut,
  RefreshCw,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { BookCard } from "@/components/ui/BookCard";
import { BookDetail } from "@/components/ui/BookDetail";
import { BookFormPanel } from "@/components/ui/BookForm";
import { LoginForm } from "@/components/ui/LoginForm";
import { LoanList } from "@/components/ui/LoanList";
import { ReservationList } from "@/components/ui/ReservationList";
import { GenreManager } from "@/components/ui/GenreManager";
import { UserManager } from "@/components/ui/UserManager";
import { ProfilePanel } from "@/components/ui/ProfilePanel";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { useLoans } from "@/hooks/useLoans";
import { useReservations } from "@/hooks/useReservations";
import { useGenres } from "@/hooks/useGenres";
import { useUsers } from "@/hooks/useUsers";
import { emptyBookForm } from "@/types";
import { toBookForm } from "@/lib/api";
import type { Book, Tab, NavItem } from "@/types";

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
    password: "Password@123",
    name: "",
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [now] = useState(() => Date.now());

  // --- Derived ---
  const activeLoans = loans.loans.filter((l) => l.status === "ACTIVE");
  const overdueLoans = activeLoans.filter(
    (l) => new Date(l.dueDate).getTime() < now,
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
    } catch (value) {
      showError(value);
    } finally {
      setLoading(false);
    }
  }, [
    auth.token,
    auth.loadProfile,
    auth.setProfileName,
    genres.loadGenres,
    books.loadBooks,
    books.bookForm.genreId,
    books.setBookForm,
    loans.loadLoans,
    reservations.loadReservations,
    showError,
  ]);

  useEffect(() => {
    void loadCore();
  }, [loadCore]);

  useEffect(() => {
    if (auth.canManageUsers) {
      void users.loadUsers();
    }
  }, [auth.canManageUsers, users, users.loadUsers]);

  // --- Stats ---
  const stats = useMemo(
    () => [
      { label: "Books", value: books.books.total, icon: BookOpen },
      {
        label: "Available",
        value: books.books.items.reduce(
          (total, b) => total + b.availableCopies,
          0,
        ),
        icon: BookOpen,
      },
      { label: "Active Loans", value: activeLoans.length, icon: CalendarClock },
      { label: "Overdue", value: overdueLoans.length, icon: CalendarClock },
    ],
    [books.books, activeLoans.length, overdueLoans.length],
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
    } catch (value) {
      showError(value);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "librarian" | "user") => {
    setLoginForm({
      email: `${role}@smartlibrary.local`,
      password: "Password@123",
      name: "",
    });
  };

  // --- Book handlers ---
  const handleBorrow = async (bookId: string) => {
    try {
      await loans.borrowBook(bookId);
      showToast("Book borrowed");
      await loadCore();
      await books.openBook(bookId);
    } catch (value) {
      showError(value);
    }
  };

  const handleReserve = async (bookId: string) => {
    try {
      await reservations.reserveBook(bookId);
      showToast("Reservation placed");
      await loadCore();
      await books.openBook(bookId);
    } catch (value) {
      showError(value);
    }
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
    } catch (value) {
      showError(value);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await books.deleteBook(id);
      showToast("Book removed");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

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
      showToast(books.bookForm.id ? "Cover uploaded and saved" : "Cover uploaded");
    } catch (value) {
      showError(value);
    } finally {
      setCoverUploading(false);
    }
  };

  // --- Loan handlers ---
  const handleReturnLoan = async (loanId: string) => {
    try {
      await loans.returnLoan(loanId);
      showToast("Book returned");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  const handleRenewLoan = async (loanId: string) => {
    try {
      await loans.renewLoan(loanId);
      showToast("Loan renewed");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  // --- Reservation handlers ---
  const handleCancelReservation = async (id: string) => {
    try {
      await reservations.cancelReservation(id);
      showToast("Reservation cancelled");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  const handleFulfillReservation = async (id: string) => {
    try {
      await reservations.fulfillReservation(id);
      showToast("Reservation fulfilled");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  // --- Genre handlers ---
  const handleSaveGenre = async (name: string) => {
    try {
      await genres.saveGenre(name);
      showToast("Genre added");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  const handleDeleteGenre = async (id: string) => {
    try {
      await genres.deleteGenre(id);
      showToast("Genre removed");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  };

  // --- User handlers ---
  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await users.updateUserRole(id, role);
      showToast("Role updated");
      await users.loadUsers();
    } catch (value) {
      showError(value);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await users.deleteUser(id);
      showToast("User deactivated");
      await users.loadUsers();
    } catch (value) {
      showError(value);
    }
  };

  // --- Profile handler ---
  const handleSaveProfile = async () => {
    try {
      await auth.saveProfile(auth.profileName);
      showToast("Profile updated");
    } catch (value) {
      showError(value);
    }
  };

  // --- Navigation items ---
  const navItems = [
    ["catalog", BookOpen, "Catalog"],
    ["loans", CalendarClock, "Loans"],
    ["reservations", RefreshCw, "Reservations"],
    ["genres", Library, "Genres"],
    ["users", Users, "Users"],
  ] satisfies NavItem[];

  // --- Helpers ---
  const selectedBookLoan = books.selectedBook
    ? loans.loans.find(
      (l) => l.bookId === books.selectedBook!.id && l.status === "ACTIVE",
    )
    : undefined;

  const selectedBookReservation = books.selectedBook
    ? reservations.reservations.find(
      (r) =>
        r.bookId === books.selectedBook!.id && r.status === "PENDING",
    )
    : undefined;

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
    <main className="app-shell">
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "is-open" : ""}`.trim()}>
        <div className="sidebar-brand">
          <Library size={28} />
          <div>
            <strong>SmartLibrary</strong>
            <span>{auth.profile?.role}</span>
          </div>
        </div>
        <nav>
          {navItems.map(([key, NavIcon, label]) => {
            if (key === "users" && !auth.canManageUsers) return null;
            if (key === "genres" && !auth.canManageLibrary) return null;
            return (
              <button
                className={tab === key ? "active" : ""}
                key={key}
                onClick={() => {
                  setTab(key as Tab);
                  if (key !== "catalog") books.closeBook();
                  setIsMobileMenuOpen(false);
                }}
                type="button"
              >
                <NavIcon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="profile-box">
          <UserRound size={18} />
          <div>
            <strong>{auth.profile?.name || "Library User"}</strong>
            <span>{auth.profile?.email}</span>
          </div>
        </div>
        <Button onClick={auth.signOut} variant="secondary">
          <LogOut size={16} />
          Sign out
        </Button>
      </aside>

      {/* Workspace */}
      <section className="workspace">
        <div
          className={`main-overlay ${isMobileMenuOpen ? "is-visible" : ""}`.trim()}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <Header
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title={
            books.selectedBook
              ? "Book Details"
              : tab === "catalog"
                ? "Library Catalog"
                : tab[0].toUpperCase() + tab.slice(1)
          }
          subtitle={
            books.selectedBook
              ? books.selectedBook.id
              : `${books.books.total} books indexed across ${genres.genres.length} genres.`
          }
          loading={loading}
          onRefresh={loadCore}
        />

        {/* Stats */}
        {!books.selectedBook && <StatsGrid stats={stats} />}

        {/* Catalog > Book Detail */}
        {tab === "catalog" && books.selectedBook && (
          <BookDetail
            book={books.selectedBook}
            bookForm={books.bookForm}
            genres={genres.genres}
            selectedBookLoan={selectedBookLoan}
            selectedBookReservation={selectedBookReservation}
            selectedBookLoading={books.selectedBookLoading}
            coverUploading={coverUploading}
            canManageLibrary={auth.canManageLibrary}
            onClose={books.closeBook}
            onBorrow={handleBorrow}
            onReserve={handleReserve}
            onEdit={(book: Book) => books.setBookForm(toBookForm(book))}
            onDelete={handleDeleteBook}
            onFormFieldChange={(field) =>
              books.setBookForm((prev) => ({ ...prev, ...field }))
            }
            onUploadCover={handleUploadCover}
            onSaveBook={handleSaveBook}
            onCancelEdit={() =>
              books.setBookForm({
                ...emptyBookForm,
                genreId: genres.genres[0]?.id ?? "",
              })
            }
          />
        )}

        {/* Catalog > Book Grid */}
        {tab === "catalog" && !books.selectedBook && (
          <section className="content-grid">
            <div className="main-column">
              <div className="toolbar">
                <label className="search-input">
                  <Search size={16} />
                  <input
                    value={books.search}
                    onChange={(e) => books.setSearch(e.target.value)}
                    placeholder="Search books"
                  />
                </label>
                <select
                  value={books.selectedGenre}
                  onChange={(e) => books.setSelectedGenre(e.target.value)}
                >
                  <option value="">All genres</option>
                  {genres.genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="book-grid">
                {books.books.items.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onOpen={books.openBook}
                    onBorrow={handleBorrow}
                    onReserve={handleReserve}
                    onEdit={(b: Book) => books.setBookForm(toBookForm(b))}
                    onDelete={handleDeleteBook}
                    canManageLibrary={auth.canManageLibrary}
                  />
                ))}
                {!books.books.items.length && (
                  <article className="empty-state">
                    <Search size={22} />
                    <strong>No books found</strong>
                    <span>
                      Try another search term or clear the genre filter.
                    </span>
                  </article>
                )}
              </div>
            </div>

            {auth.canManageLibrary && (
              <BookFormPanel
                bookForm={books.bookForm}
                genres={genres.genres}
                coverUploading={coverUploading}
                onFieldChange={(field) =>
                  books.setBookForm((prev) => ({ ...prev, ...field }))
                }
                onUploadCover={handleUploadCover}
                onSave={handleSaveBook}
                onCancelEdit={() =>
                  books.setBookForm({
                    ...emptyBookForm,
                    genreId: genres.genres[0]?.id ?? "",
                  })
                }
              />
            )}
          </section>
        )}

        {/* Loans */}
        {tab === "loans" && (
          <LoanList
            loans={loans.loans}
            onReturn={handleReturnLoan}
            onRenew={handleRenewLoan}
          />
        )}

        {/* Reservations */}
        {tab === "reservations" && (
          <ReservationList
            reservations={reservations.reservations}
            canManageLibrary={auth.canManageLibrary}
            onFulfill={handleFulfillReservation}
            onCancel={handleCancelReservation}
          />
        )}

        {/* Genres */}
        {tab === "genres" && auth.canManageLibrary && (
          <GenreManager
            genres={genres.genres}
            onSave={handleSaveGenre}
            onDelete={handleDeleteGenre}
          />
        )}

        {/* Users */}
        {tab === "users" && auth.canManageUsers && (
          <UserManager
            users={users.users}
            onUpdateRole={handleUpdateUserRole}
            onDelete={handleDeleteUser}
          />
        )}

        {/* Profile */}
        <ProfilePanel
          name={auth.profileName}
          onNameChange={auth.setProfileName}
          onSave={handleSaveProfile}
        />

        <Footer />
      </section>
    </main>
  );
}

export default App;

