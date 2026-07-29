import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { LoginForm } from "@/components/ui/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthenticatedApp } from "@/components/views/AuthenticatedApp";

function AppContent() {
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
    authMode,
    loginForm,
    setAuthMode,
    setLoginForm,
    handleSignIn,
    handleDemoLogin,
  } = useAppContext();

  if (!auth.isAuthReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-24 w-24" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <main>
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
    />
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

