import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateItem } from "@/data/templates";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface TemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
}

const categoryLabels: Record<string, string> = {
  assistant: "Assistent",
  workflow: "Workflow",
  app: "App",
};

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const IconComponent = (LucideIcons[template.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Sparkles;

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card p-4 transition-all duration-200 hover:border-border/80 hover:shadow-md"
      onClick={onClick}
    >
      {/* New/Featured badges */}
      <div className="absolute right-3 top-3 flex gap-1.5">
        {template.isNew && (
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs text-primary">
            Neu
          </Badge>
        )}
        {template.isFeatured && (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400">
            Beliebt
          </Badge>
        )}
      </div>

      {/* Icon - Monochrome */}
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <IconComponent className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Category */}
      <span className="text-xs text-muted-foreground">
        {categoryLabels[template.category]}
      </span>

      {/* Title */}
      <h3 className="mt-1 font-medium text-foreground">
        {template.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {template.description}
      </p>

      {/* Tags as subtle text */}
      {template.tags.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
          {template.tags.slice(0, 2).map((tag, i) => (
            <span key={tag.id} className="flex items-center gap-1.5">
              {i > 0 && <span>•</span>}
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
