import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { LoginResult, User } from "@/types";

export function useAuth() {
  const [token, setToken] = useState(
    () => localStorage.getItem("smartlibrary.jwt") ?? "",
  );
  const [profile, setProfile] = useState<User | null>(null);
  const [profileName, setProfileName] = useState("");

  const signIn = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      mode: "login" | "register",
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
        },
      );
      localStorage.setItem("smartlibrary.jwt", session.token);
      setToken(session.token);
      setProfile(session.user);
      setProfileName(session.user.name ?? "");
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("smartlibrary.jwt");
    setToken("");
    setProfile(null);
  }, []);

  const saveProfile = useCallback(
    async (name: string) => {
      const updated = await apiRequest<User>("/users/me", token, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      setProfile(updated);
      return updated;
    },
    [token],
  );

  const loadProfile = useCallback(async () => {
    const me = await apiRequest<User>("/users/me", token);
    setProfile(me);
    setProfileName(me.name ?? "");
    return me;
  }, [token]);

  const canManageLibrary =
    profile?.role === "LIBRARIAN" || profile?.role === "ADMIN";
  const canManageUsers = profile?.role === "ADMIN";

  return {
    token,
    profile,
    profileName,
    setProfileName,
    signIn,
    signOut,
    saveProfile,
    loadProfile,
    canManageLibrary,
    canManageUsers,
    isAuthenticated: !!token && !!profile,
  };
}
