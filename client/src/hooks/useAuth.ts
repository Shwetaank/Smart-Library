import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { LoginResult, User } from "@/types";

export function useAuth() {
  // Authentication state
  const [token, setToken] = useState(
    () => localStorage.getItem("smartlibrary.jwt") ?? ""
  );
  const [profile, setProfile] = useState<User | null>(null);
  const [profileName, setProfileName] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Load current user
  const loadProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      setIsAuthReady(true);
      return;
    }
    try {
      const me = await apiRequest<User>("/users/me", token);
      setProfile(me);
      setProfileName(me.name ?? "");
    } catch (error) {
      // Token is invalid, clear it
      setToken("");
      setProfile(null);
    } finally {
      setIsAuthReady(true);
    }
  }, [token]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  // Sign in or register
  const signIn = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      mode: "login" | "register"
    ) => {
      const session = await apiRequest<LoginResult>(
        mode === "login" ? "/auth/login" : "/auth/register",
        undefined,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            ...(mode === "register" ? { name: name.trim() || undefined } : {}),
          }),
        }
      );

      localStorage.setItem("smartlibrary.jwt", session.token);
      setToken(session.token);
      setProfile(session.user);
      setProfileName(session.user.name ?? "");
      setIsAuthReady(true);
    },
    []
  );

  // Sign out
  const signOut = useCallback(() => {
    localStorage.removeItem("smartlibrary.jwt");
    setToken("");
    setProfile(null);
    setIsAuthReady(true);
  }, []);

  // Update profile
  const saveProfile = useCallback(
    async (name: string) => {
      const updated = await apiRequest<User>("/users/me", token, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      setProfile(updated);
      return updated;
    },
    [token]
  );

  // Role permissions
  const canManageLibrary = useMemo(
    () => profile?.role === "LIBRARIAN" || profile?.role === "ADMIN",
    [profile?.role]
  );
  const canManageUsers = useMemo(() => profile?.role === "ADMIN", [
    profile?.role,
  ]);

  return useMemo(
    () => ({
      token,
      profile,
      profileName,
      setProfileName,
      signIn,
      signOut,
      saveProfile,
      canManageLibrary,
      canManageUsers,
      isAuthenticated: !!token && !!profile,
      isAuthReady,
    }),
    [
      token,
      profile,
      profileName,
      signIn,
      signOut,
      saveProfile,
      canManageLibrary,
      canManageUsers,
      isAuthReady,
    ]
  );
}
