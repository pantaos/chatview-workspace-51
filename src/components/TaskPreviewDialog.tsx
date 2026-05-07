import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar, Play, Clock, Users, Languages, User, X, Bookmark, BookmarkCheck } from "lucide-react";
import { UseCase } from "@/data/useCases";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMyTasks } from "@/hooks/use-my-tasks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  task: UseCase | null;
  onRun: (task: UseCase) => void;
  onSchedule: (task: UseCase) => void;
}

export function TaskPreviewDialog({
  open,
  onClose,
  task,
  onRun,
  onSchedule,
}: TaskPreviewDialogProps) {
  const isMobile = useIsMobile();
  const { has, add, remove } = useMyTasks();
  const [tab, setTab] = useState<"overview" | "how">("overview");

  if (!task) return null;
  const Icon = task.icon;
  const saved = has(task.id);

  const duration = task.duration || task.saves;
  const bestFor = task.bestFor || `${task.team} Team`;
  const language = task.language || "Deutsch";
  const createdBy = task.createdBy || "PANTA";
  const longDescription =
    task.longDescription ||
    task.description ||
    `Diese Aufgabe hilft dir, ${task.name.toLowerCase()} schnell und strukturiert auszuführen – ready-to-run für dein ${task.team} Team.`;
  const inputs = task.inputs && task.inputs.length > 0
    ? task.inputs
    : task.integrations.length > 0
      ? task.integrations.map((i) => `${i} (optional)`)
      : ["Thema oder Stichwort"];

  const body = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-border/50">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold leading-tight">{task.name}</h2>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground/70 uppercase">
                TASK
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {task.taskType}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">{task.description || `Ready-to-run automation for your ${task.team} team.`}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Meta icon={<Clock className="h-3.5 w-3.5" />} label="Duration" value={duration} />
          <Meta icon={<Users className="h-3.5 w-3.5" />} label="Best for" value={bestFor} />
          <Meta icon={<Languages className="h-3.5 w-3.5" />} label="Language" value={language} />
          <Meta icon={<User className="h-3.5 w-3.5" />} label="Created by" value={createdBy} />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-border/50">
        <div className="flex gap-6">
          {(["overview", "how"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "py-3 text-sm font-medium relative transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "overview" ? "Overview" : "How it works"}
              {tab === t && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 max-h-[40vh] overflow-y-auto">
        {tab === "overview" ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold mb-2">About this task</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{longDescription}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">What you need</h3>
              <div className="flex flex-wrap gap-1.5">
                {inputs.map((i) => (
                  <span
                    key={i}
                    className="rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="space-y-3 text-sm">
              {[
                `Du startest die Task und gibst die benötigten Inputs ein.`,
                `${task.name} verarbeitet die Daten${task.integrations.length ? ` und verbindet sich mit ${task.integrations.join(", ")}.` : "."}`,
                `Du erhältst das fertige Ergebnis – ready zum Teilen oder Weiterverarbeiten.`,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-2 bg-muted/20">
        <Button
          variant="outline"
          onClick={() => {
            if (saved) {
              remove(task.id);
              toast.success(`"${task.name}" aus Meine Tasks entfernt`);
            } else {
              add(task.id);
              toast.success(`"${task.name}" zu Meine Tasks hinzugefügt`);
            }
          }}
        >
          {saved ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
          {saved ? "Gespeichert" : "Speichern"}
        </Button>
        <Button variant="outline" onClick={() => onSchedule(task)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button onClick={() => onRun(task)}>
          <Play className="h-4 w-4 mr-2" />
          Start Task
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{task.name}</DrawerTitle>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 z-20 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 backdrop-blur transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>
        {body}
      </DialogContent>
    </Dialog>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xs font-medium text-foreground mt-1 leading-snug line-clamp-2">{value}</div>
    </div>
  );
}
