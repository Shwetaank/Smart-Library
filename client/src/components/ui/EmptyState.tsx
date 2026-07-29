import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = Readonly<{
    icon: LucideIcon;
    title: string;
    text: string;
}>;

export function EmptyState({ icon: Icon, title, text }: EmptyStateProps) {
    return (
        <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className="mb-4 rounded-full bg-muted p-3">
                        <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-foreground">
                        {title}
                    </h3>
                    <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
                </motion.div>
            </CardContent>
        </Card>
    );
}

