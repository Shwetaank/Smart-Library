import type { LucideIcon } from "lucide-react";

type EmptyStateProps = Readonly<{
    icon: LucideIcon;
    title: string;
    text: string;
}>;

export function EmptyState({
    icon: Icon,
    title,
    text,
}: EmptyStateProps) {
    return (
        // Empty state message
        <article className="empty-state">
            <Icon size={22} />

            {/* Empty state content */}
            <strong>{title}</strong>
            <span>{text}</span>
        </article>
    );
}