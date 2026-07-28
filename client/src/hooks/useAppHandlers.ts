import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useBooks } from "./useBooks";
import { useGenres } from "./useGenres";
import { useLoans } from "./useLoans";
import { useReservations } from "./useReservations";
import { useToast } from "./useToast";
import { useUsers } from "./useUsers";

type AppHooks = {
  auth: ReturnType<typeof useAuth>;
  books: ReturnType<typeof useBooks>;
  loans: ReturnType<typeof useLoans>;
  reservations: ReturnType<typeof useReservations>;
  genres: ReturnType<typeof useGenres>;
  users: ReturnType<typeof useUsers>;
  toast: ReturnType<typeof useToast>;
};

export function useAppHandlers(
  hooks: AppHooks,
  loadCore: () => Promise<void>,
  runAsync: (
    promise: Promise<unknown>,
    options?: {
      successMessage?: string;
      onSuccess?: () => void | Promise<void>;
    }
  ) => Promise<void>,
  setCoverUploading: (value: boolean) => void
) {
  const { auth, books, loans, reservations, genres, users, toast } = hooks;
  const { showToast, showError } = toast;

  // Book handlers
  const handleBorrow = useCallback(async (bookId: string) => {
    await runAsync(loans.borrowBook(bookId), {
      successMessage: "Book borrowed",
      onSuccess: async () => {
        await loadCore();
        await books.openBook(bookId);
      },
    });
  }, [runAsync, loans, loadCore, books]);

  const handleReserve = useCallback(async (bookId: string) => {
    await runAsync(reservations.reserveBook(bookId), {
      successMessage: "Reservation placed",
      onSuccess: async () => {
        await loadCore();
        await books.openBook(bookId);
      },
    });
  }, [runAsync, reservations, loadCore, books]);

  const handleSaveBook = useCallback(async () => {
    try {
      const detailId = await books.saveBook(books.bookForm, genres.genres);
      const isNew = !books.bookForm.id;
      showToast(isNew ? "Book added" : "Book updated");
      await loadCore();
      if (detailId && (books.selectedBook || isNew)) {
        await books.openBook(detailId);
      }
    } catch (error_) {
      showError(error_);
    }
  }, [books, genres, loadCore, showError, showToast]);

  const handleDeleteBook = useCallback((id: string) =>
    runAsync(books.deleteBook(id, books.selectedBook), {
      successMessage: "Book removed",
      onSuccess: loadCore,
    }), [runAsync, books, loadCore]);

  const handleUploadCover = useCallback(async (file?: File) => {
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
  }, [books, loadCore, setCoverUploading, showError, showToast]);

  // Loan handlers
  const handleReturnLoan = useCallback((loanId: string) =>
    runAsync(loans.returnLoan(loanId), {
      successMessage: "Book returned",
      onSuccess: loadCore,
    }), [runAsync, loans, loadCore]);

  const handleRenewLoan = useCallback((loanId: string) =>
    runAsync(loans.renewLoan(loanId), {
      successMessage: "Loan renewed",
      onSuccess: loadCore,
    }), [runAsync, loans, loadCore]);

  // Reservation handlers
  const handleCancelReservation = useCallback((id: string) =>
    runAsync(reservations.cancelReservation(id), {
      successMessage: "Reservation cancelled",
      onSuccess: loadCore,
    }), [runAsync, reservations, loadCore]);

  const handleFulfillReservation = useCallback((id: string) =>
    runAsync(reservations.fulfillReservation(id), {
      successMessage: "Reservation fulfilled",
      onSuccess: loadCore,
    }), [runAsync, reservations, loadCore]);

  // Genre handlers
  const handleSaveGenre = useCallback((name: string) =>
    runAsync(genres.saveGenre(name), {
      successMessage: "Genre added",
      onSuccess: loadCore,
    }), [runAsync, genres, loadCore]);

  const handleDeleteGenre = useCallback((id: string) =>
    runAsync(genres.deleteGenre(id), {
      successMessage: "Genre removed",
      onSuccess: loadCore,
    }), [runAsync, genres, loadCore]);

  // User handlers
  const handleUpdateUserRole = useCallback((id: string, role: string) =>
    runAsync(users.updateUserRole(id, role), {
      successMessage: "Role updated",
      onSuccess: users.loadUsers,
    }), [runAsync, users]);

  const handleDeleteUser = useCallback((id: string) =>
    runAsync(users.deleteUser(id), {
      successMessage: "User deactivated",
      onSuccess: users.loadUsers,
    }), [runAsync, users]);

  // Profile handler
  const handleSaveProfile = useCallback(() =>
    runAsync(auth.saveProfile(auth.profileName), {
      successMessage: "Profile updated",
    }), [runAsync, auth]);

  return {
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
  };
}
