import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Sparkles, Settings, Puzzle, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TemplateItem } from "@/data/templates";
import { useIsMobile } from "@/hooks/use-mobile";

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

  if (!template) return null;

  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) || LucideIcons.Sparkles;

  const capabilities = [...template.features, ...template.useCases].slice(0, 6);

  const content = (
    <ScrollArea className="h-full max-h-[70vh] md:max-h-[75vh]">
      <div className="space-y-6 p-1">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 shrink-0">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold leading-tight">{template.title}</h2>
            <p className="text-muted-foreground text-sm mt-1.5">{template.description}</p>
          </div>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: `${tag.color}14`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Capabilities */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            What it can do
          </h3>
          <ul className="space-y-2">
            {capabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-foreground/90">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personalisation */}
        {template.customizable.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Settings className="h-3 w-3" /> Personalize
            </h3>
            <div className="space-y-2">
              {template.customizable.map((field) => (
                <div
                  key={field.id}
                  className="flex items-start justify-between gap-3 py-2 border-b border-border/40 last:border-b-0"
                >
                  <div>
                    <div className="text-sm font-medium">{field.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{field.description}</div>
                  </div>
                  {field.required && (
                    <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                      Required
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested integrations */}
        {template.suggestedIntegrations.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Puzzle className="h-3 w-3" /> Works with
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {template.suggestedIntegrations.map((integration) => (
                <Badge key={integration} variant="outline" className="capitalize">
                  {integration === "microsoft"
                    ? "Microsoft 365"
                    : integration === "google"
                    ? "Google"
                    : integration === "notion"
                    ? "Notion"
                    : integration}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  const footer = (
    <div className="flex gap-2 pt-4 border-t border-border/50">
      <Button variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
      <Button onClick={() => onAdd(template)} className="flex-1">
        <Plus className="h-4 w-4 mr-2" />
        Add & Personalize
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="sr-only">{template.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 pb-safe">
            {content}
            {footer}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>{template.title}</DialogTitle>
        </DialogHeader>
        {content}
        {footer}
      </DialogContent>
    </Dialog>
  );
}
