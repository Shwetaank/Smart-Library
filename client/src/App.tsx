import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  Hash,
  Library,
  LogOut,
  Mail,
  Menu,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./components/ui/button";

type Role = "USER" | "LIBRARIAN" | "ADMIN";
type Tab = "catalog" | "loans" | "reservations" | "genres" | "users";
type NavItem = [Tab, LucideIcon, string];

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

type Genre = {
  id: string;
  name: string;
};

type Book = {
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

type Loan = {
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

type Reservation = {
  id: string;
  bookId: string;
  status: string;
  placedAt: string;
  expiresAt: string;
  fulfilledAt?: string | null;
};

type User = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isActive: boolean;
};

type LoginResult = {
  token: string;
  user: User;
};

type ToastMessage = {
  id: number;
  title: string;
  variant: "success" | "destructive";
};

type BookForm = {
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

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";
const emptyBookForm: BookForm = {
  title: "",
  author: "",
  isbn: "",
  description: "",
  publishedYear: "",
  genreId: "",
  coverUrl: "",
  quantity: "1",
};

async function apiRequest<T>(path: string, token?: string, options: RequestInit = {}) {
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

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? `Request failed with ${response.status}`);
  }

  return payload.data;
}

function toBookPayload(form: BookForm) {
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

function toBookForm(book: Book): BookForm {
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

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("smartlibrary.jwt") ?? "");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({
    email: "admin@smartlibrary.local",
    password: "Password@123",
    name: "",
  });
  const [tab, setTab] = useState<Tab>("catalog");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [books, setBooks] = useState<PageResult<Book>>({ items: [], total: 0, page: 1, limit: 12 });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookLoading, setSelectedBookLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<PageResult<User>>({ items: [], total: 0, page: 1, limit: 20 });
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [bookForm, setBookForm] = useState<BookForm>(emptyBookForm);
  const [coverUploading, setCoverUploading] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const canManageLibrary = profile?.role === "LIBRARIAN" || profile?.role === "ADMIN";
  const canManageUsers = profile?.role === "ADMIN";
  const activeLoans = loans.filter((loan) => loan.status === "ACTIVE");
  const overdueLoans = activeLoans.filter((loan) => new Date(loan.dueDate).getTime() < now);
  const selectedBookLoan = selectedBook
    ? loans.find((loan) => loan.bookId === selectedBook.id && loan.status === "ACTIVE")
    : undefined;
  const selectedBookReservation = selectedBook
    ? reservations.find((reservation) => reservation.bookId === selectedBook.id && reservation.status === "PENDING")
    : undefined;

  const showToast = useCallback((title: string, variant: ToastMessage["variant"] = "success") => {
    setToast({ id: Date.now(), title, variant });
  }, []);

  const showError = useCallback((value: unknown) => {
    showToast(value instanceof Error ? value.message : "Something went wrong", "destructive");
  }, [showToast]);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const loadCore = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [me, genrePage, bookPage, loanRows, reservationRows] = await Promise.all([
        apiRequest<User>("/users/me", token),
        apiRequest<PageResult<Genre>>("/genres?limit=100", token),
        apiRequest<PageResult<Book>>(
          `/books?limit=12&search=${encodeURIComponent(search)}&genreId=${encodeURIComponent(selectedGenre)}`,
          token,
        ),
        apiRequest<Loan[]>("/loans/history", token),
        apiRequest<Reservation[]>("/reservations", token),
      ]);

      setProfile(me);
      setProfileName(me.name ?? "");
      setGenres(genrePage.items);
      setBooks(bookPage);
      setLoans(loanRows);
      setReservations(reservationRows);
      if (!bookForm.genreId && genrePage.items[0]) {
        setBookForm((current) => ({ ...current, genreId: genrePage.items[0].id }));
      }
    } catch (value) {
      showError(value);
    } finally {
      setLoading(false);
    }
  }, [bookForm.genreId, search, selectedGenre, showError, token]);

  const loadUsers = useCallback(async () => {
    if (!token || !canManageUsers) return;
    try {
      setUsers(await apiRequest<PageResult<User>>("/users?limit=20", token));
    } catch (value) {
      showError(value);
    }
  }, [canManageUsers, showError, token]);

  useEffect(() => {
    void loadCore();
  }, [loadCore]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const stats = useMemo(
    () => [
      { label: "Books", value: books.total, icon: BookOpen },
      { label: "Available", value: books.items.reduce((total, book) => total + book.availableCopies, 0), icon: Check },
      { label: "Active Loans", value: activeLoans.length, icon: CalendarClock },
      { label: "Overdue", value: overdueLoans.length, icon: Shield },
    ],
    [activeLoans.length, books.items, books.total, overdueLoans.length],
  );

  async function signIn() {
    const email = loginForm.email.trim().toLowerCase();
    if (!email || !loginForm.password) {
      showToast("Enter your email and password.", "destructive");
      return;
    }
    try {
      setLoading(true);
      const session = await apiRequest<LoginResult>(authMode === "login" ? "/auth/login" : "/auth/register", undefined, {
        method: "POST",
        body: JSON.stringify({
          email,
          password: loginForm.password,
          ...(authMode === "register" ? { name: loginForm.name.trim() || undefined } : {}),
        }),
      });
      localStorage.setItem("smartlibrary.jwt", session.token);
      setToken(session.token);
      setProfile(session.user);
      setProfileName(session.user.name ?? "");
      showToast(authMode === "login" ? "Signed in" : "Account created");
    } catch (value) {
      showError(value);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem("smartlibrary.jwt");
    setToken("");
    setProfile(null);
    setSelectedBook(null);
    setToast(null);
  }

  async function openBook(id: string) {
    try {
      setSelectedBookLoading(true);
      setTab("catalog");
      setSelectedBook(await apiRequest<Book>(`/books/${id}`, token));
    } catch (value) {
      showError(value);
    } finally {
      setSelectedBookLoading(false);
    }
  }

  function closeBook() {
    setSelectedBook(null);
  }

  async function saveBook() {
    try {
      const payload = toBookPayload(bookForm);
      let detailBookId: string | undefined;
      if (bookForm.id) {
        const updatedBook = await apiRequest<Book>(`/books/${bookForm.id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        detailBookId = updatedBook.id;
        showToast("Book updated");
      } else {
        const createdBook = await apiRequest<Book>("/books", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        detailBookId = createdBook.id;
        showToast("Book added");
      }
      setBookForm({ ...emptyBookForm, genreId: genres[0]?.id ?? "" });
      await loadCore();
      if (detailBookId && (selectedBook || !bookForm.id)) {
        await openBook(detailBookId);
      }
    } catch (value) {
      showError(value);
    }
  }

  async function uploadCover(file?: File) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    try {
      setCoverUploading(true);
      const result = await apiRequest<{ coverUrl: string }>("/uploads/cover", token, {
        method: "POST",
        body: formData,
      });
      const currentBookForm = { ...bookForm, coverUrl: result.coverUrl };
      setBookForm(currentBookForm);

      if (currentBookForm.id) {
        const updatedBook = await apiRequest<Book>(`/books/${currentBookForm.id}`, token, {
          method: "PUT",
          body: JSON.stringify(toBookPayload(currentBookForm)),
        });
        if (selectedBook?.id === updatedBook.id) {
          await openBook(updatedBook.id);
        }
        await loadCore();
      }

      showToast(currentBookForm.id ? "Cover uploaded and saved" : "Cover uploaded");
    } catch (value) {
      showError(value);
    } finally {
      setCoverUploading(false);
    }
  }

  async function deleteBook(id: string) {
    try {
      await apiRequest<null>(`/books/${id}`, token, { method: "DELETE" });
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
      showToast("Book removed");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function borrowBook(id: string) {
    try {
      await apiRequest<Loan>("/loans/borrow", token, {
        method: "POST",
        body: JSON.stringify({ bookId: id }),
      });
      showToast("Book borrowed");
      await loadCore();
      await openBook(id);
    } catch (value) {
      showError(value);
    }
  }

  async function reserveBook(id: string) {
    try {
      await apiRequest<Reservation>("/reservations", token, {
        method: "POST",
        body: JSON.stringify({ bookId: id }),
      });
      showToast("Reservation placed");
      await loadCore();
      await openBook(id);
    } catch (value) {
      showError(value);
    }
  }

  async function mutateLoan(path: string, loanId: string, success: string) {
    try {
      await apiRequest<Loan>(path, token, {
        method: "POST",
        body: JSON.stringify({ loanId }),
      });
      showToast(success);
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function cancelReservation(id: string) {
    try {
      await apiRequest<Reservation>(`/reservations/${id}`, token, { method: "DELETE" });
      showToast("Reservation cancelled");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function fulfillReservation(id: string) {
    try {
      await apiRequest<Reservation>(`/reservations/${id}/fulfill`, token, { method: "POST" });
      showToast("Reservation fulfilled");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function saveGenre() {
    try {
      await apiRequest<Genre>("/genres", token, {
        method: "POST",
        body: JSON.stringify({ name: genreName }),
      });
      setGenreName("");
      showToast("Genre added");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function deleteGenre(id: string) {
    try {
      await apiRequest<null>(`/genres/${id}`, token, { method: "DELETE" });
      showToast("Genre removed");
      await loadCore();
    } catch (value) {
      showError(value);
    }
  }

  async function saveProfile() {
    try {
      const updated = await apiRequest<User>("/users/me", token, {
        method: "PUT",
        body: JSON.stringify({ name: profileName }),
      });
      setProfile(updated);
      showToast("Profile updated");
    } catch (value) {
      showError(value);
    }
  }

  async function updateUserRole(id: string, role: Role) {
    try {
      await apiRequest<User>(`/users/${id}/role`, token, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
      showToast("Role updated");
      await loadUsers();
    } catch (value) {
      showError(value);
    }
  }

  async function deleteUser(id: string) {
    try {
      await apiRequest<null>(`/users/${id}`, token, { method: "DELETE" });
      showToast("User deactivated");
      await loadUsers();
    } catch (value) {
      showError(value);
    }
  }

  if (!token || !profile) {
    return (
      <main className="auth-shell">
        <ShadcnToast toast={toast} onDismiss={() => setToast(null)} />
        <section className="auth-panel">
          <div className="brand-mark">
            <Library size={30} />
          </div>
          <span className="eyebrow"><Sparkles size={14} /> Digital circulation desk</span>
          <h1>SmartLibrary</h1>
          <p>Sign in to borrow books, manage reservations, and unlock role-based library tools.</p>
          <div className="auth-tabs">
            <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")} type="button">
              Sign in
            </button>
            <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")} type="button">
              Create account
            </button>
          </div>
          {authMode === "register" && (
            <label className="auth-field">
              <UserRound size={16} />
              <input
                value={loginForm.name}
                onChange={(event) => setLoginForm({ ...loginForm, name: event.target.value })}
                placeholder="Full name"
              />
            </label>
          )}
          <label className="auth-field">
            <Mail size={16} />
            <input
              value={loginForm.email}
              onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              placeholder="Email"
              type="email"
            />
          </label>
          <label className="auth-field">
            <Shield size={16} />
            <input
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              placeholder="Password"
              type="password"
            />
          </label>
          <div className="demo-logins">
            {(["admin", "librarian", "user"] as const).map((role) => (
              <button
                key={role}
                onClick={() =>
                  setLoginForm({
                    email: `${role}@smartlibrary.local`,
                    password: "Password@123",
                    name: "",
                  })
                }
                type="button"
              >
                {role}
              </button>
            ))}
          </div>
          <Button onClick={signIn} disabled={loading}>
            <Shield size={16} />
            {authMode === "login" ? "Sign in" : "Create account"}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <ShadcnToast toast={toast} onDismiss={() => setToast(null)} />
      <aside className={`sidebar ${isMobileMenuOpen ? "is-open" : ""}`.trim()}>
        <div className="sidebar-brand">
          <Library size={28} />
          <div>
            <strong>SmartLibrary</strong>
            <span>{profile.role}</span>
          </div>
        </div>
        <nav>
          {([
            ["catalog", BookOpen, "Catalog"],
            ["loans", CalendarClock, "Loans"],
            ["reservations", RefreshCw, "Reservations"],
            ["genres", Library, "Genres"],
            ["users", Users, "Users"],
          ] satisfies NavItem[]).map(([key, NavIcon, label]) => {
            if (key === "users" && !canManageUsers) return null;
            if (key === "genres" && !canManageLibrary) return null;
            return (
              <button
                className={tab === key ? "active" : ""}
                key={key}
                onClick={() => {
                  setTab(key as Tab);
                  if (key !== "catalog") setSelectedBook(null);
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
            <strong>{profile.name || "Library User"}</strong>
            <span>{profile.email}</span>
          </div>
        </div>
        <Button onClick={signOut} variant="secondary">
          <LogOut size={16} />
          Sign out
        </Button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <Button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="icon"
            >
              <Menu size={20} />
            </Button>
            <div>
              <h1>{selectedBook ? "Book Details" : tab === "catalog" ? "Library Catalog" : tab[0].toUpperCase() + tab.slice(1)}</h1>
              <p>{selectedBook ? selectedBook.id : `${books.total} books indexed across ${genres.length} genres.`}</p>
            </div>
          </div>
          <Button onClick={loadCore} variant="outline" disabled={loading}>
            <RefreshCw className={loading ? "spin-icon" : ""} size={16} />
            Refresh
          </Button>
        </header>

        {!selectedBook && (
          <section className="stats-grid">
            {stats.map((item) => (
              <article className="stat-card" key={item.label}>
                <item.icon size={18} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </section>
        )}

        {tab === "catalog" && selectedBook && (
          <section className="book-detail-grid">
            <article className="book-detail-main">
              <button className="back-link" onClick={closeBook} type="button">
                <ArrowLeft size={16} />
                Back to catalog
              </button>
              <div className="book-detail-hero">
                <div className="book-detail-cover">
                  {selectedBook.coverUrl ? (
                    <img alt={`${selectedBook.title} cover`} src={selectedBook.coverUrl} />
                  ) : (
                    selectedBook.title.slice(0, 1)
                  )}
                </div>
                <div className="book-detail-copy">
                  <span className="book-kicker">{selectedBook.genre?.name ?? "Uncategorized"}</span>
                  <h2>{selectedBook.title}</h2>
                  <p>by {selectedBook.author}</p>
                  <div className="detail-actions">
                    <Button onClick={() => borrowBook(selectedBook.id)} disabled={selectedBook.availableCopies <= 0 || Boolean(selectedBookLoan)}>
                      <BookOpen size={16} />
                      {selectedBookLoan ? "Borrowed" : "Borrow"}
                    </Button>
                    <Button onClick={() => reserveBook(selectedBook.id)} variant="outline" disabled={Boolean(selectedBookReservation)}>
                      <CalendarClock size={16} />
                      {selectedBookReservation ? "Hold placed" : "Place hold"}
                    </Button>
                    {canManageLibrary && (
                      <>
                        <Button onClick={() => setBookForm(toBookForm(selectedBook))} variant="secondary">
                          <Upload size={16} />
                          Edit
                        </Button>
                        <Button onClick={() => deleteBook(selectedBook.id)} variant="destructive">
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="availability-panel">
                <div>
                  <span>Available copies</span>
                  <strong>{selectedBook.availableCopies} of {selectedBook.quantity}</strong>
                </div>
                <div className="availability-meter" aria-label="Availability">
                  <span style={{ width: `${Math.max(0, Math.min(100, (selectedBook.availableCopies / selectedBook.quantity) * 100))}%` }} />
                </div>
              </div>

              <section className="detail-section">
                <h3>Description</h3>
                <p>{selectedBook.description || "No description has been added for this book yet."}</p>
              </section>
            </article>

            <aside className="book-detail-side">
              <section>
                <h3>Your Activity</h3>
                <dl>
                  <div>
                    <dt>Loan</dt>
                    <dd>{selectedBookLoan ? `Due ${formatDate(selectedBookLoan.dueDate)}` : "No active loan"}</dd>
                  </div>
                  <div>
                    <dt>Reservation</dt>
                    <dd>{selectedBookReservation ? `Expires ${formatDate(selectedBookReservation.expiresAt)}` : "No active hold"}</dd>
                  </div>
                </dl>
              </section>
              {selectedBookLoading && <div className="alert success">Refreshing book...</div>}
            </aside>

            {canManageLibrary && bookForm.id === selectedBook.id && (
              <aside className="side-panel detail-edit-panel">
                <h2>Edit book</h2>
                <input value={bookForm.title} onChange={(event) => setBookForm({ ...bookForm, title: event.target.value })} placeholder="Title" />
                <input value={bookForm.author} onChange={(event) => setBookForm({ ...bookForm, author: event.target.value })} placeholder="Author" />
                <input value={bookForm.isbn} onChange={(event) => setBookForm({ ...bookForm, isbn: event.target.value })} placeholder="ISBN" />
                <select value={bookForm.genreId} onChange={(event) => setBookForm({ ...bookForm, genreId: event.target.value })}>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
                <input value={bookForm.publishedYear} onChange={(event) => setBookForm({ ...bookForm, publishedYear: event.target.value })} placeholder="Published year" type="number" />
                <input value={bookForm.quantity} onChange={(event) => setBookForm({ ...bookForm, quantity: event.target.value })} placeholder="Quantity" type="number" />
                <input value={bookForm.coverUrl} onChange={(event) => setBookForm({ ...bookForm, coverUrl: event.target.value })} placeholder="Cover image URL" />
                <label className="file-control">
                  <Upload size={16} />
                  <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>
                  <input accept="image/jpeg,image/png,image/webp" disabled={coverUploading} onChange={(event) => void uploadCover(event.target.files?.[0])} type="file" />
                </label>
                <textarea value={bookForm.description} onChange={(event) => setBookForm({ ...bookForm, description: event.target.value })} placeholder="Description" />
                <Button onClick={saveBook}>
                  <Check size={16} />
                  Save changes
                </Button>
                <Button onClick={() => setBookForm({ ...emptyBookForm, genreId: genres[0]?.id ?? "" })} variant="outline">
                  <X size={16} />
                  Close editor
                </Button>
              </aside>
            )}
          </section>
        )}

        {tab === "catalog" && !selectedBook && (
          <section className="content-grid">
            <div className="main-column">
              <div className="toolbar">
                <label className="search-input">
                  <Search size={16} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search books" />
                </label>
                <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
                  <option value="">All genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div className="book-grid">
                {books.items.map((book) => (
                  <article className="book-card" key={book.id}>
                    <div className="book-cover">
                      {book.coverUrl ? <img alt={`${book.title} cover`} src={book.coverUrl} /> : book.title.slice(0, 1)}
                    </div>
                    <div className="book-body">
                      <span>{book.genre?.name ?? "Uncategorized"}</span>
                      <h2>{book.title}</h2>
                      <p>{book.author}</p>
                      <small>{book.availableCopies}/{book.quantity} available</small>
                    </div>
                    <div className="row-actions">
                      <Button onClick={() => openBook(book.id)} size="sm" variant="secondary">
                        <Hash size={14} />
                        Details
                      </Button>
                      <Button onClick={() => borrowBook(book.id)} size="sm" disabled={book.availableCopies <= 0}>
                        <BookOpen size={14} />
                        Borrow
                      </Button>
                      <Button onClick={() => reserveBook(book.id)} size="sm" variant="outline">
                        <CalendarClock size={14} />
                        Hold
                      </Button>
                      {canManageLibrary && (
                        <>
                          <Button onClick={() => setBookForm(toBookForm(book))} size="sm" variant="secondary">
                            <Upload size={14} />
                          </Button>
                          <Button onClick={() => deleteBook(book.id)} size="sm" variant="destructive">
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
                {!books.items.length && (
                  <article className="empty-state">
                    <Search size={22} />
                    <strong>No books found</strong>
                    <span>Try another search term or clear the genre filter.</span>
                  </article>
                )}
              </div>
            </div>

            {canManageLibrary && (
              <aside className="side-panel">
                <h2>{bookForm.id ? "Edit book" : "Add book"}</h2>
                <input value={bookForm.title} onChange={(event) => setBookForm({ ...bookForm, title: event.target.value })} placeholder="Title" />
                <input value={bookForm.author} onChange={(event) => setBookForm({ ...bookForm, author: event.target.value })} placeholder="Author" />
                <input value={bookForm.isbn} onChange={(event) => setBookForm({ ...bookForm, isbn: event.target.value })} placeholder="ISBN" />
                <select value={bookForm.genreId} onChange={(event) => setBookForm({ ...bookForm, genreId: event.target.value })}>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
                <input value={bookForm.publishedYear} onChange={(event) => setBookForm({ ...bookForm, publishedYear: event.target.value })} placeholder="Published year" type="number" />
                <input value={bookForm.quantity} onChange={(event) => setBookForm({ ...bookForm, quantity: event.target.value })} placeholder="Quantity" type="number" />
                <input value={bookForm.coverUrl} onChange={(event) => setBookForm({ ...bookForm, coverUrl: event.target.value })} placeholder="Cover image URL" />
                <label className="file-control">
                  <Upload size={16} />
                  <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>
                  <input accept="image/jpeg,image/png,image/webp" disabled={coverUploading} onChange={(event) => void uploadCover(event.target.files?.[0])} type="file" />
                </label>
                {bookForm.coverUrl && (
                  <div className="cover-preview">
                    <img alt="Selected book cover" src={bookForm.coverUrl} />
                  </div>
                )}
                <textarea value={bookForm.description} onChange={(event) => setBookForm({ ...bookForm, description: event.target.value })} placeholder="Description" />
                <Button onClick={saveBook}>
                  <Plus size={16} />
                  {bookForm.id ? "Save book" : "Add book"}
                </Button>
                {bookForm.id && (
                  <Button onClick={() => setBookForm({ ...emptyBookForm, genreId: genres[0]?.id ?? "" })} variant="outline">
                    <X size={16} />
                    Cancel edit
                  </Button>
                )}
              </aside>
            )}
          </section>
        )}

        {tab === "loans" && (
          <section className="table-panel">
            {loans.map((loan) => (
              <article className="list-row" key={loan.id}>
                <div>
                  <strong>{loan.book?.title ?? loan.bookId}</strong>
                  <span>{loan.status} due {formatDate(loan.dueDate)}</span>
                </div>
                {loan.status === "ACTIVE" && (
                  <div className="row-actions">
                    <Button onClick={() => mutateLoan("/loans/renew", loan.id, "Loan renewed")} size="sm" variant="outline">
                      <RotateCcw size={14} />
                      Renew
                    </Button>
                    <Button onClick={() => mutateLoan("/loans/return", loan.id, "Book returned")} size="sm">
                      <Check size={14} />
                      Return
                    </Button>
                  </div>
                )}
              </article>
            ))}
            {!loans.length && <EmptyState icon={CalendarClock} title="No loans yet" text="Borrowed books will appear here." />}
          </section>
        )}

        {tab === "reservations" && (
          <section className="table-panel">
            {reservations.map((reservation) => (
              <article className="list-row" key={reservation.id}>
                <div>
                  <strong>{reservation.bookId}</strong>
                  <span>{reservation.status} expires {formatDate(reservation.expiresAt)}</span>
                </div>
                <div className="row-actions">
                  {canManageLibrary && reservation.status === "PENDING" && (
                    <Button onClick={() => fulfillReservation(reservation.id)} size="sm">
                      <Check size={14} />
                      Fulfill
                    </Button>
                  )}
                  <Button onClick={() => cancelReservation(reservation.id)} size="sm" variant="outline">
                    <X size={14} />
                    Cancel
                  </Button>
                </div>
              </article>
            ))}
            {!reservations.length && <EmptyState icon={RefreshCw} title="No reservations" text="Placed holds will show up here." />}
          </section>
        )}

        {tab === "genres" && canManageLibrary && (
          <section className="content-grid">
            <div className="table-panel">
              {genres.map((genre) => (
                <article className="list-row" key={genre.id}>
                  <strong>{genre.name}</strong>
                  <Button onClick={() => deleteGenre(genre.id)} size="sm" variant="destructive">
                    <Trash2 size={14} />
                  </Button>
                </article>
              ))}
              {!genres.length && <EmptyState icon={Library} title="No genres" text="Create the first genre to organize the catalog." />}
            </div>
            <aside className="side-panel">
              <h2>Add genre</h2>
              <input value={genreName} onChange={(event) => setGenreName(event.target.value)} placeholder="Genre name" />
              <Button onClick={saveGenre}>
                <Plus size={16} />
                Add genre
              </Button>
            </aside>
          </section>
        )}

        {tab === "users" && canManageUsers && (
          <section className="table-panel">
            {users.items.map((user) => (
              <article className="list-row" key={user.id}>
                <div>
                  <strong>{user.name || user.email}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="row-actions">
                  <select value={user.role} onChange={(event) => updateUserRole(user.id, event.target.value as Role)}>
                    <option value="USER">USER</option>
                    <option value="LIBRARIAN">LIBRARIAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <Button onClick={() => deleteUser(user.id)} size="sm" variant="destructive">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </article>
            ))}
            {!users.items.length && <EmptyState icon={Users} title="No users found" text="Registered users will appear here." />}
          </section>
        )}

        <section className="profile-panel">
          <h2>Profile</h2>
          <input value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder="Your name" />
          <Button onClick={saveProfile} variant="outline">
            <Check size={16} />
            Save profile
          </Button>
        </section>
      </section>
    </main>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <article className="empty-state">
      <Icon size={22} />
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

function ShadcnToast({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) {
  if (!toast) return null;

  return (
    <div className="toast-viewport" role="region" aria-label="Notifications">
      <div className={`toast-root ${toast.variant}`} role={toast.variant === "destructive" ? "alert" : "status"}>
        <div className="toast-copy">
          <strong>{toast.variant === "destructive" ? "Action failed" : "Success"}</strong>
          <span>{toast.title}</span>
        </div>
        <button className="toast-close" onClick={onDismiss} type="button" aria-label="Dismiss notification">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default App;
