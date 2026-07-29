import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    showToast: (
      message: string,
      variant: "success" | "destructive" = "success",
    ) => {
      if (variant === "destructive") {
        sonnerToast.error(message, {
          duration: 3500,
        });
      } else {
        sonnerToast.success(message, {
          duration: 2500,
        });
      }
    },
    showError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      sonnerToast.error(message, {
        duration: 4000,
      });
    },
  };
}
