import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-base py-4 px-6",
          description: "group-[.toast]:text-muted-foreground text-sm mt-1",
          actionButton:
            "group-[.toast]:bg-neutral-900 group-[.toast]:text-neutral-100 group-[.toast]:hover:bg-neutral-800 dark:group-[.toast]:bg-neutral-100 dark:group-[.toast]:text-neutral-900 dark:group-[.toast]:hover:bg-neutral-200",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
