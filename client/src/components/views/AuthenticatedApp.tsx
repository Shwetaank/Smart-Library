import { BookOpen, CalendarClock } from "lucide-react";

import type { Book, Loan, Reservation, Tab } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { useGenres } from "@/hooks/useGenres";
import { useLoans } from "@/hooks/useLoans";
import { useReservations } from "@/hooks/useReservations";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";
import { toBookForm } from "@/lib/api";
import { emptyBookForm } from "@/types";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BookDetail from "@/components/ui/BookDetail";
import { GenreManager } from "@/components/ui/GenreManager";
import { LoanList } from "@/components/ui/LoanList";
import { ProfilePanel } from "@/components/ui/ProfilePanel";
import { ReservationList } from "@/components/ui/ReservationList";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { Toast } from "@/components/ui/Toast";
import { UserManager } from "@/components/ui/UserManager";
import { CatalogView } from "@/components/views/CatalogView";

interface AuthenticatedAppProps {
  toast: ReturnType<typeof useToast>["toast"];
  dismissToast: ReturnType<typeof useToast>["dismissToast"];
  auth: ReturnType<typeof useAuth>;
  books: ReturnType<typeof useBooks>;
  loans: ReturnType<typeof useLoans>;
  reservations: ReturnType<typeof useReservations>;
  genres: ReturnType<typeof useGenres>;
  users: ReturnType<typeof useUsers>;
  tab: Tab;
  setTab: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  loading: boolean;
  activeLoans: Loan[];
  overdueLoans: Loan[];
  coverUploading: boolean;
  loadCore: () => Promise<void>;
  handleBorrow: (bookId: string) => Promise<void>;
  handleReserve: (bookId: string) => Promise<void>;
  handleSaveBook: () => Promise<void>;
  handleDeleteBook: (id: string) => Promise<void>;
  handleUploadCover: (file?: File) => Promise<void>;
  handleReturnLoan: (loanId: string) => Promise<void>;
  handleRenewLoan: (loanId: string) => Promise<void>;
  handleCancelReservation: (id: string) => Promise<void>;
  handleFulfillReservation: (id: string) => Promise<void>;
  handleSaveGenre: (name: string) => Promise<void>;
  handleDeleteGenre: (id: string) => Promise<void>;
  handleUpdateUserRole: (id: string, role: string) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
  handleSaveProfile: () => Promise<void>;
  getHeaderTitle: () => string;
  selectedBookLoan: Loan | undefined;
  selectedBookReservation: Reservation | undefined;
}

export function AuthenticatedApp({
  toast,
  dismissToast,
  auth,
  books,
  loans,
  reservations,
  genres,
  users,
  tab,
  setTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  loading,
  activeLoans,
  overdueLoans,
  coverUploading,
  loadCore,
  handleBorrow,
  handleReserve,
  handleSaveBook,
  handleDeleteBook,
  handleUploadCover,
  handleReturnLoan,
  handleRenewLoan,
  handleCancelReservation,
  handleFulfillReservation,
  handleSaveGenre,
  handleDeleteGenre,
  handleUpdateUserRole,
  handleDeleteUser,
  handleSaveProfile,
  getHeaderTitle,
  selectedBookLoan,
  selectedBookReservation,
}: AuthenticatedAppProps) {
  const stats = [
    { label: "Books", value: books.books.total, icon: BookOpen },
    {
      label: "Available",
      value: books.books.items.reduce(
        (total, b) => total + b.availableCopies,
        0
      ),
      icon: BookOpen,
    },
    { label: "Active Loans", value: activeLoans.length, icon: CalendarClock },
    { label: "Overdue", value: overdueLoans.length, icon: CalendarClock },
  ];

  const renderTabContent = () => {
    switch (tab) {
      case "catalog":
        return books.selectedBook ? (
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
        ) : (
          <CatalogView
            search={books.search}
            onSearchChange={books.setSearch}
            selectedGenre={books.selectedGenre}
            onGenreChange={books.setSelectedGenre}
            genres={genres.genres}
            books={books.books}
            onOpenBook={books.openBook}
            onBorrow={handleBorrow}
            onReserve={handleReserve}
            onEditBook={(b: Book) => books.setBookForm(toBookForm(b))}
            onDeleteBook={handleDeleteBook}
            canManageLibrary={auth.canManageLibrary}
            bookForm={books.bookForm}
            genresForForm={genres.genres}
            coverUploading={coverUploading}
            onBookFormFieldChange={(field) =>
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
        );
      case "loans":
        return (
          <LoanList
            loans={loans.loans}
            onReturn={handleReturnLoan}
            onRenew={handleRenewLoan}
          />
        );
      case "reservations":
        return (
          <ReservationList
            reservations={reservations.reservations}
            canManageLibrary={auth.canManageLibrary}
            onFulfill={handleFulfillReservation}
            onCancel={handleCancelReservation}
          />
        );
      case "genres":
        return auth.canManageLibrary ? (
          <GenreManager
            genres={genres.genres}
            onSave={handleSaveGenre}
            onDelete={handleDeleteGenre}
          />
        ) : null;
      case "users":
        return auth.canManageUsers ? (
          <UserManager
            users={users.users}
            onUpdateRole={handleUpdateUserRole}
            onDelete={handleDeleteUser}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <main className="app-shell">
      <Toast toast={toast} onDismiss={dismissToast} />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        profile={auth.profile}
        onSignOut={auth.signOut}
        activeTab={tab}
        onTabChange={(newTab) => {
          setTab(newTab as Tab);
          if (newTab !== "catalog") books.closeBook();
        }}
        canManageUsers={auth.canManageUsers}
        canManageLibrary={auth.canManageLibrary}
      />
      <section className="workspace">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title={getHeaderTitle()}
          subtitle={
            books.selectedBook
              ? books.selectedBook.id
              : `${books.books.total} books indexed across ${genres.genres.length} genres.`
          }
          loading={loading}
          onRefresh={loadCore}
        />
        {!books.selectedBook && <StatsGrid stats={stats} />}
        {renderTabContent()}
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
