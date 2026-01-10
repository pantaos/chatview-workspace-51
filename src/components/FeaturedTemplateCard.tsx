import { Card } from "@/components/ui/card";
import { TemplateItem } from "@/data/templates";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface FeaturedTemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
}

const categoryGradients: Record<string, string> = {
  assistant: "from-blue-500 to-blue-600",
  workflow: "from-purple-500 to-purple-600",
  app: "from-emerald-500 to-emerald-600",
};

const categoryLabels: Record<string, string> = {
  assistant: "Assistent",
  workflow: "Workflow",
  app: "App",
};

export function FeaturedTemplateCard({ template, onClick }: FeaturedTemplateCardProps) {
  const IconComponent = (LucideIcons[template.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Sparkles;
  const gradient = categoryGradients[template.category] || categoryGradients.assistant;

  return (
    <Card
      className={`group relative min-w-[280px] max-w-[320px] cursor-pointer overflow-hidden rounded-2xl border-0 bg-gradient-to-br ${gradient} p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <IconComponent className="h-6 w-6 text-white" />
      </div>

      {/* Category Badge */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {categoryLabels[template.category]}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-white">
        {template.title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-sm text-white/80">
        {template.description}
      </p>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/5" />
    </Card>
  );
}
