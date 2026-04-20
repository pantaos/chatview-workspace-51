import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const STAGES = [
  { id: "fn", label: "Functionality check", detail: "Boots, routes resolve, no runtime errors." },
  { id: "wire", label: "Frontend ↔ Backend wiring", detail: "API calls and env vars look healthy." },
  { id: "style", label: "Style standardization", detail: "Mapping to platform sidebar, tabs and theme colors." },
  { id: "preview", label: "Live preview", detail: "Rendering a mock of your standardized app." },
];

interface ReviewStepProps {
  onComplete: () => void;
}

export function ReviewStep({ onComplete }: ReviewStepProps) {
  const [completed, setCompleted] = useState<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (completed >= STAGES.length) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setCompleted((c) => c + 1), 1200);
    return () => clearTimeout(t);
  }, [completed, onComplete]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">AI review</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We're checking your app and standardizing the look so it fits the platform.
        </p>
      </div>

      <ol className="space-y-2">
        {STAGES.map((s, i) => {
          const done = i < completed;
          const active = i === completed;
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 transition-colors",
                done && "border-emerald-500/30 bg-emerald-500/5",
                active && "bg-muted/30",
                !done && !active && "opacity-60"
              )}
              style={active ? { borderColor: theme.primaryColor } : undefined}
            >
              <div
                className={cn(
                  "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                  done && "bg-emerald-500/15 text-emerald-600",
                  active && "text-primary"
                )}
                style={active ? { backgroundColor: `${theme.primaryColor}1a`, color: theme.primaryColor } : undefined}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              </div>
              <div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>

      {completed >= STAGES.length && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            All checks passed — ready for preview.
          </div>
        </div>
      )}
    </div>
  );
}
