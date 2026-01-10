import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Sparkles, TrendingUp } from "lucide-react";
import { TemplateItem } from "@/data/templates";
import * as LucideIcons from "lucide-react";

interface TemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
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

const categoryLabels: Record<string, string> = {
  assistant: "Assistent",
  workflow: "Workflow",
  app: "App",
};

const categoryColors: Record<string, string> = {
  assistant: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  workflow: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  app: "bg-green-500/10 text-green-600 dark:text-green-400",
};

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const IconComponent = iconMap[template.icon] || LucideIcons.Box;
  
  const formatUsageCount = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges für Neu/Featured */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        {template.isNew && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-1.5 py-0.5">
            <Sparkles className="h-3 w-3 mr-1" />
            Neu
          </Badge>
        )}
        {template.isFeatured && !template.isNew && (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-1.5 py-0.5">
            <TrendingUp className="h-3 w-3 mr-1" />
            Beliebt
          </Badge>
        )}
      </div>

      <div className="p-4">
        {/* Icon und Kategorie */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <IconComponent className="h-6 w-6" />
          </div>
          <Badge variant="outline" className={`text-xs ${categoryColors[template.category]}`}>
            {categoryLabels[template.category]}
          </Badge>
        </div>

        {/* Titel und Beschreibung */}
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {template.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 2).map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
              style={{ 
                backgroundColor: `${tag.color}15`,
                color: tag.color,
              }}
            >
              <span 
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </div>
          ))}
        </div>

        {/* Rating und Usage */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          {template.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{template.rating}</span>
            </div>
          )}
          {template.usageCount && (
            <span>{formatUsageCount(template.usageCount)} Nutzungen</span>
          )}
        </div>
      </div>

      {/* Hover-Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}
      />
    </Card>
  );
}
