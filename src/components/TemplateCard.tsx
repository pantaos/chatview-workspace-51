import { TemplateItem } from "@/data/templates";
import { LucideIcon, Sparkles, Users } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
  isCommunity?: boolean;
}

export function TemplateCard({ template, onClick, isCommunity }: TemplateCardProps) {
  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as LucideIcon) ||
    LucideIcons.Sparkles;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-xl border border-border/60 bg-card p-4",
        "transition-all duration-150 hover:border-foreground/20 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
          <IconComponent className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-foreground">{template.title}</h3>
            {template.isNew && (
              <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Neu
              </span>
            )}
            {template.isFeatured && !template.isNew && !isCommunity && (
              <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
            )}
            {isCommunity && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Users className="h-2.5 w-2.5" />
                Community
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {template.description}
          </p>

          {template.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
