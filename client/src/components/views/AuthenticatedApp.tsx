import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarClock } from "lucide-react";

import type { Book, BookForm, Tab } from "@/types";
import { toBookForm } from "@/lib/api";
import { emptyBookForm } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BookDetail from "@/components/ui/BookDetail";
import { GenreManager } from "@/components/ui/GenreManager";
import { LoanList } from "@/components/ui/LoanList";
import { ProfilePanel } from "@/components/ui/ProfilePanel";
import { ReservationList } from "@/components/ui/ReservationList";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { UserManager } from "@/components/ui/UserManager";
import { CatalogView } from "@/components/views/CatalogView";

export function AuthenticatedApp() {
  const {
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
    handlers,
    getHeaderTitle,
    selectedBookLoan,
    selectedBookReservation,
  } = useAppContext();

  const {
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
  } = handlers;

  const stats = [
    {
      label: "Total Books",
      value: books.books.total,
      icon: BookOpen,
      color: "emerald",
    },
    {
      label: "Available",
      value: books.books.items.reduce(
        (total, b) => total + b.availableCopies,
        0
      ),
      icon: BookOpen,
      color: "cyan",
    },
    {
      label: "Active Loans",
      value: activeLoans.length,
      icon: CalendarClock,
      color: "blue",
    },
    {
      label: "Overdue",
      value: overdueLoans.length,
      icon: CalendarClock,
      color: "amber",
    },
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
            onFormFieldChange={(field: Partial<BookForm>) =>
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
            onBookFormFieldChange={(field: Partial<BookForm>) =>
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
    <div className="min-h-screen bg-background">
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
      <div className="lg:pl-64">
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
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 lg:px-8">
          {!books.selectedBook && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StatsGrid stats={stats} />
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + (books.selectedBook ? "-detail" : "")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
          <ProfilePanel
            name={auth.profileName}
            onNameChange={auth.setProfileName}
            onSave={handleSaveProfile}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

