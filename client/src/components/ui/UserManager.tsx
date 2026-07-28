import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PageResult, Role, User } from "@/types";

type UserManagerProps = {
    users: PageResult<User>;
    onUpdateRole: (id: string, role: Role) => void;
    onDelete: (id: string) => void;
};

export function UserManager({
    users,
    onUpdateRole,
    onDelete,
}: UserManagerProps) {
    return (
        <section className="table-panel">
            {users.items.map((user) => (
                <article className="list-row" key={user.id}>
                    <div>
                        <strong>{user.name || user.email}</strong>
                        <span>{user.email}</span>
                    </div>
                    <div className="row-actions">
                        <select
                            value={user.role}
                            onChange={(e) =>
                                onUpdateRole(user.id, e.target.value as Role)
                            }
                        >
                            <option value="USER">USER</option>
                            <option value="LIBRARIAN">LIBRARIAN</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        <Button
                            onClick={() => onDelete(user.id)}
                            size="sm"
                            variant="destructive"
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </article>
            ))}
            {!users.items.length && (
                <EmptyState
                    icon={Users}
                    title="No users found"
                    text="Registered users will appear here."
                />
            )}
        </section>
    );
}

