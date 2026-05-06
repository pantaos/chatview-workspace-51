import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Play, Calendar, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { allUseCases, UseCase } from "@/data/useCases";
import { useMyTasks } from "@/hooks/use-my-tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduleDialog from "@/components/ScheduleDialog";

const MyTasksTab = () => {
  const navigate = useNavigate();
  const { ids, add, remove } = useMyTasks();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scheduleTarget, setScheduleTarget] = useState<UseCase | null>(null);

  const myTasks = useMemo(
    () => ids.map((id) => allUseCases.find((u) => u.id === id)).filter(Boolean) as UseCase[],
    [ids]
  );

  const available = useMemo(() => {
    const q = search.toLowerCase();
    return allUseCases.filter(
      (u) =>
        !ids.includes(u.id) &&
        (q === "" ||
          u.name.toLowerCase().includes(q) ||
          u.team.toLowerCase().includes(q) ||
          u.taskType.toLowerCase().includes(q))
    );
  }, [ids, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Meine Tasks</h3>
            <span className="text-xs text-muted-foreground">({myTasks.length})</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Schnellzugriff auf deine wichtigsten Tasks. Direkt ausführen oder planen.
          </p>
        </div>
        <Button size="sm" onClick={() => setPickerOpen(true)} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Task hinzufügen
        </Button>
      </div>

      {myTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
          <ListChecks className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Noch keine Tasks hinzugefügt</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="mt-1"
          >
            Aus dem Explorer wählen
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {myTasks.map((task) => {
            const Icon = task.icon;
            return (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 hover:border-foreground/20 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{task.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {task.team} · {task.taskType} · saves {task.saves}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setScheduleTarget(task)}
                    title="Planen"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/use-cases/run/${task.id}`)}
                    title="Ausführen"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      remove(task.id);
                      toast.success(`"${task.name}" entfernt`);
                    }}
                    title="Entfernen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-base">Task hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tasks durchsuchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto px-3 pb-4">
            {available.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Keine weiteren Tasks verfügbar
              </div>
            ) : (
              <div className="space-y-1">
                {available.map((task) => {
                  const Icon = task.icon;
                  return (
                    <button
                      key={task.id}
                      onClick={() => {
                        add(task.id);
                        toast.success(`"${task.name}" hinzugefügt`);
                      }}
                      className="w-full flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{task.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {task.team} · {task.taskType}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {scheduleTarget && (
        <ScheduleDialog
          open={!!scheduleTarget}
          onOpenChange={(o) => !o && setScheduleTarget(null)}
          useCaseName={scheduleTarget.name}
        />
      )}
    </div>
  );
};

export default MyTasksTab;
