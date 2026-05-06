import { UseCase } from "@/data/useCases";
import { cn } from "@/lib/utils";
import { Calendar, Play } from "lucide-react";

interface TaskCardProps {
  task: UseCase;
  onRun: () => void;
  onSchedule: () => void;
}

export function TaskCard({ task, onRun, onSchedule }: TaskCardProps) {
  const Icon = task.icon;
  const visible = task.integrations.slice(0, 3);
  const extra = task.integrations.length - visible.length;

  return (
    <div
      className={cn(
        "group relative w-full text-left rounded-2xl border border-border/50 bg-card p-5",
        "transition-all duration-200 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.25)]",
        "flex flex-col"
      )}
    >
      <button
        onClick={onRun}
        className="flex items-start gap-4 text-left focus-visible:outline-none"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">{task.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {task.team} · saves {task.saves}
          </p>
        </div>
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {visible.map((i) => (
          <span
            key={i}
            className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {i}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            +{extra}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
        <button
          onClick={onRun}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <Play className="h-3 w-3" />
          Run
        </button>
        <button
          onClick={onSchedule}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Calendar className="h-3 w-3" />
          Schedule
        </button>
      </div>
    </div>
  );
}
