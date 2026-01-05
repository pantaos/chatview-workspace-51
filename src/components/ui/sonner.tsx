import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border/50 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold",
          description: "group-[.toast]:text-sm group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground group-[.toast]:text-sm group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:hover:bg-secondary/80",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-border/50 group-[.toast]:hover:bg-muted group-[.toast]:hover:text-foreground group-[.toast]:rounded-md group-[.toast]:transition-all",
          success: "group-[.toaster]:text-foreground [&>svg]:text-green-500",
          error: "group-[.toaster]:text-foreground [&>svg]:text-red-500",
          warning: "group-[.toaster]:text-foreground [&>svg]:text-amber-500",
          info: "group-[.toaster]:text-foreground [&>svg]:text-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
