import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { PageResult, User } from "@/types";

export function useUsers(token: string) {
  const [users, setUsers] = useState<PageResult<User>>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
  });

  const loadUsers = useCallback(async () => {
    const page = await apiRequest<PageResult<User>>("/users?limit=20", token);
    setUsers(page);
    return page;
  }, [token]);

  const updateUserRole = useCallback(
    async (id: string, role: string) => {
      await apiRequest<User>(`/users/${id}/role`, token, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
    },
    [token],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      await apiRequest<null>(`/users/${id}`, token, { method: "DELETE" });
    },
    [token],
  );

  return { users, setUsers, loadUsers, updateUserRole, deleteUser };
}
