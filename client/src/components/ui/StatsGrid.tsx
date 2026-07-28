import type { LucideIcon } from "lucide-react";

type StatItem = {
    label: string;
    value: number;
    icon: LucideIcon;
};

export function StatsGrid({ stats }: { stats: StatItem[] }) {
    return (
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

