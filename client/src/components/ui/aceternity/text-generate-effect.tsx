"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}

export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}: TextGenerateEffectProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const wordsArray = words.split(" ");

    useEffect(() => {
        if (currentIndex < wordsArray.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, duration * 1000);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, wordsArray.length, duration]);

    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <p className="text-2xl leading-snug tracking-wide md:text-4xl lg:text-5xl">
                    {wordsArray.map((word, index) => (
                        <span
                            key={index}
                            className={cn(
                                "transition-all duration-500",
                                index <= currentIndex
                                    ? filter
                                        ? "opacity-100 blur-0"
                                        : "opacity-100"
                                    : filter
                                        ? "opacity-0 blur-lg"
                                        : "opacity-0"
                            )}
                        >
                            {word}{" "}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

