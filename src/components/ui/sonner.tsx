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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/60 group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/5 group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground/80",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-muted/50 group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted group-[.toast]:border-border/40",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
