import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TemplateItem } from "@/data/templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: TemplateItem | null;
  onAdd: (template: TemplateItem) => void;
}

export function TemplatePreviewDialog({
  open,
  onClose,
  template,
  onAdd,
}: TemplatePreviewDialogProps) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"overview" | "systemprompt">("overview");

  if (!template) return null;

  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) || LucideIcons.Sparkles;

  const longDescription =
    template.longDescription ||
    `${template.title} hilft dir bei deiner Arbeit – schneller, konsistenter und auf deinen Stil abgestimmt.`;

  // Split long description into paragraphs (split on double newline or single newline)
  const paragraphs = longDescription.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  const useCases = template.useCases ?? [];
  const features = template.features ?? [];

  const body = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="text-2xl font-bold leading-tight text-foreground">{template.title}</h2>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="rounded-md bg-primary/10 text-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase">
                Assistant
              </span>
              {template.tags[0] && (
                <span className="rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                  {template.tags[0].name}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-5 leading-relaxed">{template.description}</p>
      </div>

      {/* Tabs */}
      <div className="px-7 border-b border-border/60">
        <div className="flex gap-7">
          {(["overview", "systemprompt"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "py-2.5 text-sm font-semibold relative transition-colors",
                tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "overview" ? "Overview" : "Systemprompt"}
              {tab === t && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-7 py-6 max-h-[52vh] overflow-y-auto">
        {tab === "overview" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold mb-2.5 text-foreground">About this assistant</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {useCases.length > 0 && (
                  <>
                    <p className="pt-1">It is especially useful for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {useCases.slice(0, 6).map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {features.length > 0 && (
              <div className="border-t border-border/50 pt-5">
                <ul className="space-y-2.5">
                  {features.slice(0, 8).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {template.starters.length > 0 && (
              <div className="border-t border-border/50 pt-5">
                <h3 className="text-sm font-bold mb-3 text-foreground">Example prompts</h3>
                <div className="space-y-2">
                  {template.starters.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      className="w-full text-left flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm hover:border-primary/40 hover:bg-primary/[0.03] transition-all"
                    >
                      <span className="truncate text-foreground/90">{s.displayText}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold mb-2.5 text-foreground">System prompt</h3>
            <pre className="rounded-xl border border-border/60 bg-muted/40 p-4 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">
              {template.systemPrompt || "Kein System Prompt hinterlegt."}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-7 py-4 border-t border-border/60 flex justify-end">
        <Button onClick={() => onAdd(template)} className="rounded-xl">
          Use Assistant
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{template.title}</DrawerTitle>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{template.title}</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 z-20 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 backdrop-blur transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>
        {body}
      </DialogContent>
    </Dialog>
  );
}
