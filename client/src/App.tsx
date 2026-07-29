import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { LoginForm } from "@/components/ui/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthenticatedApp } from "@/components/views/AuthenticatedApp";

function AppContent() {
  const {
    auth,
    loading,
    authMode,
    loginForm,
    setAuthMode,
    setLoginForm,
    handleSignIn,
    handleDemoLogin,
  } = useAppContext();

  if (!auth.isAuthReady) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Preparing library shell…</span>
            <span>Just a moment</span>
          </div>
        </div>
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

  return <AuthenticatedApp />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

