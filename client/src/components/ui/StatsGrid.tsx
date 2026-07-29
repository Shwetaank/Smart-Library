import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatItem = Readonly<{
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
}>;

type StatsGridProps = Readonly<{
    stats: StatItem[];
}>;

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", ring: "ring-cyan-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-500", ring: "ring-blue-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20" },
};

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item) => {
                const colors = colorMap[item.color] ?? colorMap.emerald;
                return (
                    <Card key={item.label} className="relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardContent className="p-4 md:p-5">
                            <div className="flex items-center justify-between">
                                <div className={`rounded-lg ${colors.bg} p-2.5 ring-1 ${colors.ring}`}>
                                    <item.icon size={18} className={colors.text} />
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {item.label}
                                </p>
                                <p className="text-2xl font-bold text-foreground md:text-3xl">
                                    {item.value}
                                </p>
                            </div>
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60"
                                style={{
                                    background: `linear-gradient(90deg, oklch(0.65 0.13 176), oklch(0.62 0.13 37))`,
                                }}
                            />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

