import { TemplateItem } from "@/data/templates";
import { LucideIcon, Sparkles, Users } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface TemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
  isCommunity?: boolean;
}

export function TemplateCard({ template, onClick, isCommunity }: TemplateCardProps) {
  const { theme } = useTheme();
  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as LucideIcon) ||
    LucideIcons.Sparkles;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-2xl border border-border/50 bg-card p-5",
        "transition-all duration-200 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-foreground">{template.title}</h3>
            {template.isNew && (
              <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Neu
              </span>
            )}
            {template.isFeatured && !template.isNew && !isCommunity && (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            )}
            {isCommunity && (
              <span
                className="shrink-0 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: `${theme.accentColor}1f`, color: theme.accentColor }}
              >
                <Users className="h-2.5 w-2.5" />
                Community
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
      </div>

      {template.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${tag.color}14`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
