import { TemplateItem } from "@/data/templates";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface FeaturedTemplateCardProps {
  template: TemplateItem;
  onClick: () => void;
}

const accentGradients = [
  "from-indigo-500 via-blue-500 to-cyan-500",
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
];

function pickGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return accentGradients[hash % accentGradients.length];
}

export function FeaturedTemplateCard({ template, onClick }: FeaturedTemplateCardProps) {
  const IconComponent =
    (LucideIcons[template.icon as keyof typeof LucideIcons] as LucideIcon) ||
    LucideIcons.Sparkles;
  const gradient = pickGradient(template.id);

  return (
    <button
      onClick={onClick}
      className="group relative min-w-[78vw] md:min-w-[320px] max-w-[360px] flex-shrink-0 snap-start overflow-hidden rounded-3xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      {/* Soft noise / depth */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30">
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="mt-6 text-xl font-semibold leading-tight text-white">
          {template.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/85">
          {template.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
          <span>Assistant</span>
          {template.tags[0] && (
            <>
              <span>·</span>
              <span>{template.tags[0].name}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
