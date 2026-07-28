import { X } from "lucide-react";
import type { ToastMessage } from "@/types";

export function Toast({
    toast,
    onDismiss,
}: {
    toast: ToastMessage | null;
    onDismiss: () => void;
}) {
    if (!toast) return null;

    return (
        <div className="toast-viewport" role="region" aria-label="Notifications">
            <div
                className={`toast-root ${toast.variant}`}
                role={toast.variant === "destructive" ? "alert" : "status"}
            >
                <div className="toast-copy">
                    <strong>{toast.variant === "destructive" ? "Action failed" : "Success"}</strong>
                    <span>{toast.title}</span>
                </div>
                <button
                    className="toast-close"
                    onClick={onDismiss}
                    type="button"
                    aria-label="Dismiss notification"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

