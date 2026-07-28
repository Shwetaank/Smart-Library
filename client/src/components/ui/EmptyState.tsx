import type { LucideIcon } from "lucide-react";

export function EmptyState({
    icon: Icon,
    title,
    text,
}: {
    icon: LucideIcon;
    title: string;
    text: string;
}) {
    return (
        <article className="empty-state">
            <Icon size={22} />
            <strong>{title}</strong>
            <span>{text}</span>
        </article>
    );
}

