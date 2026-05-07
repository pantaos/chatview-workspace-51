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
import { Check, Eye, Plus, ArrowRight, X, BookOpen, Users, Languages, User } from "lucide-react";
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
  const [tab, setTab] = useState<"overview" | "capabilities">("overview");

  if (!template) return null;

  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) || LucideIcons.Sparkles;

  const useCasesShort =
    template.useCases?.slice(0, 2).join(", ") || template.tags.map((t) => t.name).join(", ");
  const bestFor = template.bestFor || "Teams & Einzelpersonen";
  const language = template.language || "Deutsch, Englisch";
  const createdBy = template.createdBy || "PANTA";
  const longDescription =
    template.longDescription ||
    `${template.title} hilft dir bei deiner Arbeit – schneller, konsistenter und auf deinen Stil abgestimmt.`;

  const body = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-border/50">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100 shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold leading-tight">{template.title}</h2>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground/70 uppercase">
                ASSISTANT
              </span>
              {template.tags[0] && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {template.tags[0].name}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">{template.description}</p>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Meta icon={<BookOpen className="h-3.5 w-3.5" />} label="Use cases" value={useCasesShort} />
          <Meta icon={<Users className="h-3.5 w-3.5" />} label="Best for" value={bestFor} />
          <Meta icon={<Languages className="h-3.5 w-3.5" />} label="Language" value={language} />
          <Meta icon={<User className="h-3.5 w-3.5" />} label="Created by" value={createdBy} />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-border/50">
        <div className="flex gap-6">
          {(["overview", "capabilities"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "py-3 text-sm font-medium relative transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "overview" ? "Overview" : "Capabilities"}
              {tab === t && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 max-h-[40vh] overflow-y-auto">
        {tab === "overview" ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold mb-2">About this assistant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{longDescription}</p>
            </div>

            {template.starters.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Example prompts</h3>
                <div className="space-y-2">
                  {template.starters.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      className="w-full text-left flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-2.5 text-sm hover:border-foreground/20 hover:shadow-sm transition-all"
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
          <div className="space-y-4">
            {template.features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">What it can do</h3>
                <ul className="space-y-2">
                  {[...template.features, ...template.useCases].slice(0, 8).map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="text-foreground/90">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {template.suggestedIntegrations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Works with</h3>
                <div className="flex flex-wrap gap-1.5">
                  {template.suggestedIntegrations.map((i) => (
                    <span
                      key={i}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80 capitalize"
                    >
                      {i === "microsoft" ? "Microsoft 365" : i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-2 bg-muted/20">
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={() => onAdd(template)}>
          <Plus className="h-4 w-4 mr-2" />
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

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xs font-medium text-foreground mt-1 leading-snug line-clamp-2">{value}</div>
    </div>
  );
}
