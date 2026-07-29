import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-emerald-200 group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:border-emerald-800 dark:group-[.toaster]:bg-emerald-950/80",
          error:
            "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 dark:group-[.toaster]:border-red-800 dark:group-[.toaster]:bg-red-950/80",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

