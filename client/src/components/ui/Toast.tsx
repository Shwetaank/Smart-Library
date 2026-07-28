import { X } from "lucide-react";
import type { ToastMessage } from "@/types";

type ToastProps = Readonly<{
    toast: ToastMessage | null;
    onDismiss: () => void;
}>;

export function Toast({
    toast,
    onDismiss,
}: ToastProps) {
    if (!toast) return null;

    const content = (
        <>
            {/* Toast content */}
            <div className="toast-copy">
                <strong>
                    {toast.variant === "destructive"
                        ? "Action failed"
                        : "Success"}
                </strong>

                <span>{toast.title}</span>
            </div>

            {/* Dismiss button */}
            <button
                className="toast-close"
                onClick={onDismiss}
                type="button"
                aria-label="Dismiss notification"
            >
                <X size={16} />
            </button>
        </>
    );

    return (
        // Toast notification
        <section
            className="toast-viewport"
            aria-label="Notifications"
        >
            {toast.variant === "destructive" ? (
                <div
                    className={`toast-root ${toast.variant}`}
                    role="alert"
                >
                    {content}
                </div>
            ) : (
                <output
                    className={`toast-root ${toast.variant}`}
                >
                    {content}
                </output>
            )}
        </section>
    );
}