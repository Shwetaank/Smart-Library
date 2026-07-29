import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const duration = 650;
        const from = display;
        const to = value;

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const next = Math.round(from + (to - from) * eased);
            setDisplay(next);
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value]);

    return <>{display}</>;
}

export function StatsGrid({ stats }: StatsGridProps) {
    const orderedStats = useMemo(() => stats, [stats]);

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {orderedStats.map((item, index) => {
                const colors = colorMap[item.color] ?? colorMap.emerald;
                return (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                    >
                        <Card className="relative overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md">
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
                                    <p className="text-2xl font-bold text-foreground tabular-nums md:text-3xl">
                                        <AnimatedNumber value={item.value} />
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
                    </motion.div>
                );
            })}
        </div>
    );
}

