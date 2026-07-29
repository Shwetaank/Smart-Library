"use client";
import { cn } from "@/lib/utils";

interface BackgroundBeamsProps {
    className?: string;
}

export const BackgroundBeams = ({ className }: BackgroundBeamsProps) => {
    const beams = [
        { cx: "50%", cy: "0%", rx: "40%", ry: "40%", opacity: 0.3, delay: 0 },
        { cx: "20%", cy: "60%", rx: "30%", ry: "50%", opacity: 0.15, delay: 0.2 },
        { cx: "80%", cy: "40%", rx: "35%", ry: "45%", opacity: 0.2, delay: 0.5 },
        { cx: "60%", cy: "80%", rx: "25%", ry: "35%", opacity: 0.1, delay: 0.8 },
        { cx: "30%", cy: "20%", rx: "20%", ry: "30%", opacity: 0.2, delay: 0.3 },
        { cx: "70%", cy: "70%", rx: "28%", ry: "38%", opacity: 0.15, delay: 0.6 },
    ];

    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none",
                className
            )}
        >
            <svg
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
            >
                <defs>
                    <radialGradient id="beam-gradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="oklch(0.63 0.12 176 / 0.3)" />
                        <stop offset="100%" stopColor="oklch(0.63 0.12 176 / 0)" />
                    </radialGradient>
                </defs>
                {beams.map((beam, i) => (
                    <ellipse
                        key={i}
                        cx={beam.cx}
                        cy={beam.cy}
                        rx={beam.rx}
                        ry={beam.ry}
                        fill="url(#beam-gradient)"
                        opacity={beam.opacity}
                        className="animate-pulse"
                        style={{
                            animationDelay: `${beam.delay}s`,
                            animationDuration: "4s",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

