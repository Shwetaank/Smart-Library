import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { PageResult, User } from "@/types";

export function useUsers(token: string) {
  // User state
  const [users, setUsers] = useState<PageResult<User>>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
  });

  // Load users
  const loadUsers = useCallback(async (): Promise<void> => {
    const page = await apiRequest<PageResult<User>>("/users?limit=20", token);

    setUsers(page);
  }, [token]);

  // Update user role
  const updateUserRole = useCallback(
    async (id: string, role: string) => {
      await apiRequest<User>(`/users/${id}/role`, token, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
    },
    [token]
  );

  // Delete user
  const deleteUser = useCallback(
    async (id: string) => {
      await apiRequest<null>(`/users/${id}`, token, {
        method: "DELETE",
      });
    },
    [token]
  );

  return useMemo(
    () => ({
      users,
      setUsers,
      loadUsers,
      updateUserRole,
      deleteUser,
    }),
    [users, loadUsers, updateUserRole, deleteUser]
  );
}
