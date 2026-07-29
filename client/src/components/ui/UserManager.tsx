import { Shield, Trash2 } from "lucide-react";

import type { PageResult, Role, User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserManagerProps {
  users: PageResult<User>;
  onUpdateRole: (id: string, role: string) => void;
  onDelete: (id: string) => void;
}

const roleColors: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  ADMIN: "destructive",
  LIBRARIAN: "warning",
  USER: "secondary",
};

export function UserManager({
  users,
  onUpdateRole,
  onDelete,
}: UserManagerProps) {
  return (
    <div className="space-y-3">
      {users.items.map((user) => (
        <Card key={user.id} className="transition-all hover:shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <Shield size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name || user.email}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Badge
                variant={roleColors[user.role] ?? "outline"}
                className="shrink-0 text-[10px]"
              >
                {user.role}
              </Badge>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Select
                value={user.role}
                onValueChange={(value) => onUpdateRole(user.id, value as Role)}
              >
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="LIBRARIAN">LIBRARIAN</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => onDelete(user.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:hover:bg-red-950/50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {!users.items.length && (
        <EmptyState
          icon={Shield}
          title="No users found"
          text="Registered users will appear here."
        />
      )}
    </div>
  );
}