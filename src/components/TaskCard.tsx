import { UseCase } from "@/data/useCases";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: UseCase;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const Icon = task.icon;
  const visible = task.integrations.slice(0, 2);
  const extra = task.integrations.length - visible.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-xl border border-border/60 bg-card p-4",
        "transition-all duration-150 hover:border-foreground/20 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{task.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {task.team} · saves {task.saves}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1">
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {task.taskType}
            </span>
            {visible.map((i) => (
              <span
                key={i}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {i}
              </span>
            ))}
            {extra > 0 && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                +{extra}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
