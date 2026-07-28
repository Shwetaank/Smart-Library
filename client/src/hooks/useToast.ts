import { useCallback, useEffect, useState } from "react";
import type { ToastMessage } from "@/types";

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (title: string, variant: ToastMessage["variant"] = "success") => {
      setToast({ id: Date.now(), title, variant });
    },
    [],
  );

  const showError = useCallback(
    (value: unknown) => {
      showToast(
        value instanceof Error ? value.message : "Something went wrong",
        "destructive",
      );
    },
    [showToast],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return { toast, showToast, showError, dismissToast };
}
