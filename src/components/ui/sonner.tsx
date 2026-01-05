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
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border/40 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-black/10 group-[.toaster]:rounded-2xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          title: "group-[.toast]:text-[13px] group-[.toast]:font-medium group-[.toast]:text-foreground/90",
          description: "group-[.toast]:text-[12px] group-[.toast]:text-muted-foreground/70 group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-[12px] group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted/50 group-[.toast]:text-muted-foreground group-[.toast]:text-[12px] group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:hover:bg-muted",
          closeButton:
            "group-[.toast]:!bg-transparent group-[.toast]:!border-0 group-[.toast]:text-muted-foreground/60 group-[.toast]:hover:text-foreground group-[.toast]:transition-colors",
          success: "group-[.toaster]:!border-l-2 group-[.toaster]:!border-l-green-500/60",
          error: "group-[.toaster]:!border-l-2 group-[.toaster]:!border-l-red-500/60",
          warning: "group-[.toaster]:!border-l-2 group-[.toaster]:!border-l-yellow-500/60",
          info: "group-[.toaster]:!border-l-2 group-[.toaster]:!border-l-primary/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
