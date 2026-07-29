"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
    className?: string;
    children?: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
    return (
        <div
            className={cn(
                "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
};

interface BentoGridItemProps {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: BentoGridItemProps) => {
    return (
        <div
            className={cn(
                "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-4 shadow-input transition duration-200 hover:shadow-lg dark:shadow-none",
                className
            )}
        >
            {header}
            <div className="transition duration-200 group-hover/bento:translate-x-1">
                {icon}
                <div className="mb-2 mt-2 font-sans font-bold text-card-foreground">
                    {title}
                </div>
                <div className="font-sans text-xs text-muted-foreground">
                    {description}
                </div>
            </div>
        </div>
    );
};

