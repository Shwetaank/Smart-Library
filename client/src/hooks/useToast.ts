import { useCallback, useEffect, useMemo, useState } from "react";
import type { ToastMessage } from "@/types";

export function useToast() {
  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Show toast
  const showToast = useCallback(
    (title: string, variant: ToastMessage["variant"] = "success") => {
      setToast({
        id: Date.now(),
        title,
        variant,
      });
    },
    []
  );

  // Show error toast
  const showError = useCallback(
    (value: unknown) => {
      showToast(
        value instanceof Error ? value.message : "Something went wrong",
        "destructive"
      );
    },
    [showToast]
  );

  // Dismiss toast
  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return useMemo(
    () => ({
      toast,
      showToast,
      showError,
      dismissToast,
    }),
    [showToast, showError, dismissToast]
  );
}
