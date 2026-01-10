import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  Puzzle,
  Plus,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TemplateItem } from "@/data/templates";
import { useIsMobile } from "@/hooks/use-mobile";

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: TemplateItem | null;
  onAdd: (template: TemplateItem) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail: LucideIcons.Mail,
  HelpCircle: LucideIcons.HelpCircle,
  Palette: LucideIcons.Palette,
  FileText: LucideIcons.FileText,
  Languages: LucideIcons.Languages,
  Users: LucideIcons.Users,
  MessageSquare: LucideIcons.MessageSquare,
  BarChart: LucideIcons.BarChart,
  Calendar: LucideIcons.Calendar,
  Briefcase: LucideIcons.Briefcase,
};

const customizableTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  knowledge: LucideIcons.BookOpen,
  tone: LucideIcons.MessageCircle,
  language: LucideIcons.Globe,
  integrations: LucideIcons.Puzzle,
  custom: LucideIcons.Settings,
};

const categoryLabels: Record<string, string> = {
  assistant: "Assistent",
  workflow: "Workflow",
  app: "App",
};

export function TemplatePreviewDialog({
  open,
  onClose,
  template,
  onAdd,
}: TemplatePreviewDialogProps) {
  const isMobile = useIsMobile();
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  if (!template) return null;

  const IconComponent = iconMap[template.icon] || LucideIcons.Box;

  const formatUsageCount = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handlePrevScreenshot = () => {
    setCurrentScreenshot((prev) =>
      prev === 0 ? template.screenshots.length - 1 : prev - 1
    );
  };

  const handleNextScreenshot = () => {
    setCurrentScreenshot((prev) =>
      prev === template.screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const content = (
    <ScrollArea className="h-full max-h-[70vh] md:max-h-[80vh]">
      <div className="space-y-6 p-1">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <IconComponent className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold truncate">{template.title}</h2>
              <Badge variant="outline" className="shrink-0">
                {categoryLabels[template.category]}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Screenshots */}
        {template.screenshots.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Screenshots
            </h3>
            <div className="relative rounded-lg overflow-hidden bg-muted/30 border border-border/50">
              <img
                src={template.screenshots[currentScreenshot]}
                alt={`Screenshot ${currentScreenshot + 1}`}
                className="w-full h-48 object-cover"
              />
              {template.screenshots.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevScreenshot(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors z-10 shadow-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextScreenshot(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors z-10 shadow-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {template.screenshots.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          index === currentScreenshot
                            ? "bg-primary"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Use Cases */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Use Cases
          </h3>
          <ul className="space-y-2">
            {template.useCases.map((useCase, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span className="text-muted-foreground">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Features
          </h3>
          <ul className="space-y-2">
            {template.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Personalisierung */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Personalisierung
          </h3>
          <div className="space-y-3">
            {template.customizable.map((field) => {
              const FieldIcon = customizableTypeIcons[field.type] || Settings;
              return (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                    <FieldIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{field.label}</span>
                      {field.required && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          Erforderlich
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {field.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empfohlene Integrationen */}
        {template.suggestedIntegrations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Puzzle className="h-4 w-4 text-muted-foreground" />
              Empfohlene Integrationen
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.suggestedIntegrations.map((integration) => (
                <Badge key={integration} variant="outline" className="capitalize">
                  {integration === "microsoft" ? "Microsoft 365" : 
                   integration === "google" ? "Google" : 
                   integration === "notion" ? "Notion" : integration}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  const footer = (
    <div className="flex gap-2 pt-4 border-t">
      <Button variant="outline" onClick={onClose} className="flex-1">
        Abbrechen
      </Button>
      <Button onClick={() => onAdd(template)} className="flex-1">
        <Plus className="h-4 w-4 mr-2" />
        Hinzufügen & Anpassen
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(open) => !open && onClose()}>
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
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{template.title}</DialogTitle>
        </DialogHeader>
        {content}
        {footer}
      </DialogContent>
    </Dialog>
  );
}
