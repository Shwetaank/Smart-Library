import type { LucideIcon } from "lucide-react";

type StatItem = Readonly<{
    label: string;
    value: number;
    icon: LucideIcon;
}>;

type StatsGridProps = Readonly<{
    stats: StatItem[];
}>;

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        // Statistics grid
        <section className="stats-grid">
            {stats.map((item) => (
                <article className="stat-card" key={item.label}>
                    <item.icon size={18} />

                    <span>{item.label}</span>

                    <strong>{item.value}</strong>
                </article>
            ))}
        </section>
    );
}