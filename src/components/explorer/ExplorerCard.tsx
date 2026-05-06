import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplorerCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: React.ReactNode;
  tone?: "blue" | "violet" | "green" | "amber" | "rose" | "cyan";
  onClick: () => void;
}

const TONES: Record<NonNullable<ExplorerCardProps["tone"]>, string> = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

const TONE_KEYS = Object.keys(TONES) as (keyof typeof TONES)[];
export function pickTone(seed: string): keyof typeof TONES {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONE_KEYS[h % TONE_KEYS.length];
}

export function ExplorerCard({
  icon: Icon,
  title,
  description,
  meta,
  tone = "blue",
  onClick,
}: ExplorerCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-2xl border border-border/60 bg-card p-5",
        "transition-all duration-150 hover:border-foreground/20 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "flex flex-col min-h-[180px]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="text-xs text-muted-foreground">{meta}</div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground group-hover:text-foreground group-hover:bg-muted transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}
